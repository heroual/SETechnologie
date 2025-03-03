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
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, isDemoMode } from '../lib/firebase';
import { Product, ProductFormData } from '../types';
import { logActivity } from './activityLogService';

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

// Store active listeners to avoid duplicate subscriptions
const activeListeners: { [key: string]: () => void } = {};

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

// Subscribe to products collection with real-time updates
export const subscribeToProducts = (callback: (products: Product[]) => void): (() => void) => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    // Simulate real-time updates with mock data
    callback(mockProducts);
    return () => {}; // Return empty unsubscribe function
  }

  // Check if we already have an active listener
  if (activeListeners['products']) {
    return activeListeners['products'];
  }

  const productsCollection = collection(db, 'products');
  const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
    const products = snapshot.docs.map(convertProduct);
    callback(products);
  }, (error) => {
    console.error("Error subscribing to products:", error);
  });

  // Store the unsubscribe function
  activeListeners['products'] = unsubscribe;
  return unsubscribe;
};

// Subscribe to a single product with real-time updates
export const subscribeToProduct = (id: string, callback: (product: Product | null) => void): (() => void) => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    // Simulate real-time updates with mock data
    const product = mockProducts.find(p => p.id === id) || null;
    callback(product);
    return () => {}; // Return empty unsubscribe function
  }

  // Check if we already have an active listener for this product
  const listenerKey = `product_${id}`;
  if (activeListeners[listenerKey]) {
    return activeListeners[listenerKey];
  }

  const productRef = doc(db, 'products', id);
  const unsubscribe = onSnapshot(productRef, (doc) => {
    if (doc.exists()) {
      callback(convertProduct(doc));
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to product ${id}:`, error);
    callback(null);
  });

  // Store the unsubscribe function
  activeListeners[listenerKey] = unsubscribe;
  return unsubscribe;
};

// Get all products (non-realtime)
export const getProducts = async (): Promise<Product[]> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return mockProducts;
  }

  const productsCollection = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCollection);
  return productsSnapshot.docs.map(convertProduct);
};

// Get active products (non-realtime)
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

// Get product by ID (non-realtime)
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
export const createProduct = async (
  productData: ProductFormData, 
  files: File[], 
  userId: string
): Promise<string> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const newId = `demo-product-${Date.now()}`;
    const newProduct = {
      id: newId,
      ...productData,
      images: files.length > 0 ? ['https://via.placeholder.com/300'] : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return newId;
  }

  // Create product document first
  const productData2 = {
    ...productData,
    images: [],
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, 'products'), productData2);
  const productId = docRef.id;
  
  // Upload images if any
  if (files.length > 0) {
    const imageUrls = await Promise.all(
      files.map(file => uploadProductImage(file, productId))
    );
    
    // Update product with image URLs
    await updateDoc(docRef, { images: imageUrls });
  }
  
  // Log activity
  await logActivity(
    userId,
    'create',
    'product',
    productId,
    { name: productData.name }
  );
  
  return productId;
};

// Update product
export const updateProduct = async (
  id: string, 
  productData: ProductFormData, 
  files: File[], 
  userId: string
): Promise<void> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = {
        ...mockProducts[index],
        ...productData,
        updated_at: new Date().toISOString()
      };
      
      // Add new images if any
      if (files.length > 0) {
        mockProducts[index].images = [
          ...mockProducts[index].images,
          ...files.map(() => 'https://via.placeholder.com/300')
        ];
      }
    }
    return;
  }

  const productRef = doc(db, 'products', id);
  
  // Get current product to check existing images
  const productDoc = await getDoc(productRef);
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }
  
  const currentProduct = productDoc.data();
  
  // Upload new images if any
  let updatedImages = currentProduct.images || [];
  if (files.length > 0) {
    const newImageUrls = await Promise.all(
      files.map(file => uploadProductImage(file, id))
    );
    updatedImages = [...updatedImages, ...newImageUrls];
  }
  
  // Update product
  await updateDoc(productRef, {
    ...productData,
    images: updatedImages,
    updated_at: serverTimestamp()
  });
  
  // Log activity
  await logActivity(
    userId,
    'update',
    'product',
    id,
    { name: productData.name }
  );
};

// Delete product
export const deleteProduct = async (id: string, userId: string): Promise<void> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedProduct = mockProducts[index];
      mockProducts.splice(index, 1);
      
      // Log activity
      console.log(`Product ${deletedProduct.name} deleted in demo mode`);
    }
    return;
  }

  // Get product to delete
  const productRef = doc(db, 'products', id);
  const productDoc = await getDoc(productRef);
  
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }
  
  const product = productDoc.data();
  
  // Delete images from storage
  if (product.images && product.images.length > 0) {
    await Promise.all(
      product.images.map(async (imageUrl: string) => {
        try {
          // Extract the path from the URL
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
        } catch (error) {
          console.error('Error deleting image:', error);
          // Continue with deletion even if image deletion fails
        }
      })
    );
  }
  
  // Delete product document
  await deleteDoc(productRef);
  
  // Log activity
  await logActivity(
    userId,
    'delete',
    'product',
    id,
    { name: product.name }
  );
};

// Upload product image
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    return "https://via.placeholder.com/300";
  }

  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `products/${productId}/${fileName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Delete product image
export const deleteProductImage = async (productId: string, imageUrl: string): Promise<void> => {
  // Check if we're using demo configuration
  if (isDemoMode) {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      product.images = product.images.filter(img => img !== imageUrl);
    }
    return;
  }

  try {
    // Delete from storage
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    
    // Update product document
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const product = productDoc.data();
      const updatedImages = (product.images || []).filter((img: string) => img !== imageUrl);
      
      await updateDoc(productRef, {
        images: updatedImages,
        updated_at: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};