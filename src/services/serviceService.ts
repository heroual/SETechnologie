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
    serverTimestamp 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '../lib/firebase';
  import { Service } from '../types';
  
  // Convert Firestore data to Service type
  const convertService = (doc: any): Service => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      category: data.category,
      description: data.description,
      image: data.image || '',
      pricing_type: data.pricing_type,
      price: data.price,
      status: data.status,
      featured: data.featured || false,
      created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
      updated_at: data.updated_at?.toDate().toISOString() || new Date().toISOString()
    };
  };
  
  // Get all services
  export const getServices = async (): Promise<Service[]> => {
    const servicesCollection = collection(db, 'services');
    const servicesSnapshot = await getDocs(servicesCollection);
    return servicesSnapshot.docs.map(convertService);
  };
  
  // Get available services
  export const getAvailableServices = async (): Promise<Service[]> => {
    const servicesCollection = collection(db, 'services');
    const q = query(servicesCollection, where('status', '==', 'available'));
    const servicesSnapshot = await getDocs(q);
    return servicesSnapshot.docs.map(convertService);
  };
  
  // Get featured services
  export const getFeaturedServices = async (): Promise<Service[]> => {
    const servicesCollection = collection(db, 'services');
    const q = query(servicesCollection, where('featured', '==', true));
    const servicesSnapshot = await getDocs(q);
    return servicesSnapshot.docs.map(convertService);
  };
  
  // Get service by ID
  export const getServiceById = async (id: string): Promise<Service | null> => {
    const serviceDoc = await getDoc(doc(db, 'services', id));
    if (!serviceDoc.exists()) return null;
    return convertService(serviceDoc);
  };
  
  // Create service
  export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const serviceData = {
      ...service,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'services'), serviceData);
    return docRef.id;
  };
  
  // Update service
  export const updateService = async (id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<void> => {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      ...service,
      updated_at: serverTimestamp()
    });
  };
  
  // Delete service
  export const deleteService = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'services', id));
  };
  
  // Upload service image
  export const uploadServiceImage = async (file: File, serviceId: string): Promise<string> => {
    const storageRef = ref(storage, `services/${serviceId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };