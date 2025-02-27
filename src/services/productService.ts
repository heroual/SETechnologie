import { 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    serverTimestamp,
    Timestamp
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '../lib/firebase';
  import { Product } from '../types';
  
  // Convert Firestore data to Product type
  const convertProduct = (doc: any): Product => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      category: data.category,
      description: data.description,
      images: data.images || [],
      price: data.price,
      stock: data.stock,
      status: data.status,
      seo_keywords: data.seo_keywords || [],
      created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      updated_at: data.updated_at?.toDate().toISOString() || new Date().toISOString()
    };
  };
  
  // Get all products
  export const getProducts = async (): Promise<Product[]> => {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    return productsSnapshot.docs.map(convertProduct);
  };
  
  // Get active products
  export const getActiveProducts = async (): Promise<Product[]> => {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where('status', '==', 'active'));
    const productsSnapshot = await getDocs(q);
    return productsSnapshot.docs.map(convertProduct);
  };
  
  // Get product by ID
  export const getProductById = async (id: string): Promise<Product | null> => {
    const productDoc = await getDoc(doc(db, 'products', id));
    if (!productDoc.exists()) return null;
    return convertProduct(productDoc);
  };
  
  // Create product
  export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const productData = {
      ...product,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'products'), productData);
    return docRef.id;
  };
  
  // Update product
  export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...product,
      updated_at: serverTimestamp()
    });
  };
  
  // Delete product
  export const deleteProduct = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'products', id));
  };
  
  // Upload product image
  export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };