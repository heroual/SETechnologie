import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { db, auth, isDemoMode } from '../lib/firebase';
  import { User } from '../types';
  
  // Mock users for demo mode
  const mockUsers: User[] = [
    {
      id: 'admin-user',
      email: 'admin@setechnologie.ma',
      role: 'admin',
      created_at: new Date(Date.now() - 30000000).toISOString()
    },
    {
      id: 'manager-user',
      email: 'manager@setechnologie.ma',
      role: 'manager',
      created_at: new Date(Date.now() - 20000000).toISOString()
    },
    {
      id: 'employee-user',
      email: 'employee@setechnologie.ma',
      role: 'employee',
      created_at: new Date(Date.now() - 10000000).toISOString()
    }
  ];
  
  // Convert Firestore data to User type
  const convertUser = (doc: any): User => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email,
      role: data.role,
      created_at: data.created_at?.toDate().toISOString() || new Date().toISOString()
    };
  };
  
  // Get all users
  export const getUsers = async (): Promise<User[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockUsers;
    }
  
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(convertUser);
  };
  
  // Get user by ID
  export const getUserById = async (id: string): Promise<User | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockUsers.find(user => user.id === id) || null;
    }
  
    const userDoc = await getDoc(doc(db, 'users', id));
    if (!userDoc.exists()) return null;
    return convertUser(userDoc);
  };
  
  // Get user by email
  export const getUserByEmail = async (email: string): Promise<User | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockUsers.find(user => user.email === email) || null;
    }
  
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const usersSnapshot = await getDocs(q);
    
    if (usersSnapshot.empty) return null;
    return convertUser(usersSnapshot.docs[0]);
  };
  
  // Create user
  export const createUser = async (email: string, password: string, role: 'admin' | 'manager' | 'employee'): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Create user operation not available in demo mode");
      return "demo-user-id";
    }
  
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      email,
      role,
      created_at: serverTimestamp()
    });
    
    return uid;
  };
  
  // Update user role
  export const updateUserRole = async (id: string, role: 'admin' | 'manager' | 'employee'): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Update user role operation not available in demo mode");
      return;
    }
  
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { role });
  };
  
  // Delete user (Note: This doesn't delete the Auth user, only the Firestore document)
  export const deleteUserDocument = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Delete user operation not available in demo mode");
      return;
    }
  
    await deleteDoc(doc(db, 'users', id));
  };