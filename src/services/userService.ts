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
  import { db, auth } from '../lib/firebase';
  import { User } from '../types';
  
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
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(convertUser);
  };
  
  // Get user by ID
  export const getUserById = async (id: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, 'users', id));
    if (!userDoc.exists()) return null;
    return convertUser(userDoc);
  };
  
  // Get user by email
  export const getUserByEmail = async (email: string): Promise<User | null> => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const usersSnapshot = await getDocs(q);
    
    if (usersSnapshot.empty) return null;
    return convertUser(usersSnapshot.docs[0]);
  };
  
  // Create user
  export const createUser = async (email: string, password: string, role: 'admin' | 'manager' | 'employee'): Promise<string> => {
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
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { role });
  };
  
  // Delete user (Note: This doesn't delete the Auth user, only the Firestore document)
  export const deleteUserDocument = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', id));
  };