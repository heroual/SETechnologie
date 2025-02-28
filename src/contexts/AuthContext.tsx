import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseAuthUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from '../lib/firebase';
import { FirebaseUser, AuthContextType } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      // Check if we're using demo configuration
      if (isDemoMode) {
        // Simulate login for demo mode
        const demoUser: FirebaseUser = {
          uid: "demo-user-id",
          email: email,
          displayName: "Demo User",
          photoURL: null
        };
        setCurrentUser(demoUser);
        setIsAdmin(true);
        toast.success('Connexion réussie (mode démo)');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      if (userData.role !== 'admin' && userData.role !== 'manager') {
        await signOut(auth);
        throw new Error('Insufficient permissions');
      }
      
      setIsAdmin(userData.role === 'admin');
      toast.success('Connexion réussie');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion. Vérifiez vos identifiants.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check if we're using demo configuration
      if (isDemoMode) {
        // Simulate logout for demo mode
        setCurrentUser(null);
        setIsAdmin(false);
        toast.success('Déconnexion réussie (mode démo)');
        return;
      }

      await signOut(auth);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  useEffect(() => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      // Skip auth state listener for demo mode
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseAuthUser | null) => {
      if (user) {
        // Transform Firebase user to our app user format
        const appUser: FirebaseUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        
        // Check user role
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'admin');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
        
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};