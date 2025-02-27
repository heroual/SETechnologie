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
  import { db, storage, isDemoMode } from '../lib/firebase';
  import { Product } from '../types';
  
  // Mock products for demo mode
  const mockProducts: Product[] = [
    {
      id: 'router-pro-x1',
      name: 'Router Pro X1',
      category: 'Réseau',
      description: 'Routeur professionnel haute performance avec technologie Wi-Fi 6E pour une couverture optimale et des vitesses ultra-rapides.',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'],
      price: 1299,
      stock: 25,
      status: 'active',
      seo_keywords: ['router', 'wifi', 'réseau', 'internet'],
      created_at: new Date(Date.now() - 3000000).toISOString(),
      updated_at: new Date(Date.now() - 1000000).toISOString()
    },
    {
      id: 'camera-360-pro',
      name: 'Caméra 360° Pro',
      category: 'Sécurité',
      description: 'Caméra de surveillance 360° avec vision nocturne et détection de mouvement IA.',
      images: ['https://images.unsplash.com/photo-1557324232-b8917d3c3dcb'],
      price: 899,
      stock: 15,
      status: 'active',
      seo_keywords: ['caméra', 'surveillance', 'sécurité'],
      created_at: new Date(Date.now() - 5000000).toISOString(),
      updated_at: new Date(Date.now() - 2000000).toISOString()
    }
  ];
  
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
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockProducts;
    }
  
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    return productsSnapshot.docs.map(convertProduct);
  };
  
  // Get active products
  export const getActiveProducts = async (): Promise<Product[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockProducts.filter(product => product.status === 'active');
    }
  
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where('status', '==', 'active'));
    const productsSnapshot = await getDocs(q);
    return productsSnapshot.docs.map(convertProduct);
  };
  
  // Get product by ID
  export const getProductById = async (id: string): Promise<Product | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockProducts.find(product => product.id === id) || null;
    }
  
    const productDoc = await getDoc(doc(db, 'products', id));
    if (!productDoc.exists()) return null;
    return convertProduct(productDoc);
  };
  
  // Create product
  export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Create product operation not available in demo mode");
      return "demo-product-id";
    }
  
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
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Update product operation not available in demo mode");
      return;
    }
  
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...product,
      updated_at: serverTimestamp()
    });
  };
  
  // Delete product
  export const deleteProduct = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Delete product operation not available in demo mode");
      return;
    }
  
    await deleteDoc(doc(db, 'products', id));
  };
  
  // Upload product image
  export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Upload image operation not available in demo mode");
      return "https://via.placeholder.com/300";
    }
  
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };