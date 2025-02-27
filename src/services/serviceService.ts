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
  import { db, storage, isDemoMode } from '../lib/firebase';
  import { Service } from '../types';
  
  // Mock services for demo mode
  const mockServices: Service[] = [
    {
      id: 'wifi-installation',
      name: 'Installation Wi-Fi',
      category: 'Réseau',
      description: 'Installation de réseaux Wi-Fi à haut débit, en intérieur comme en extérieur, avec des points d\'accès optimisés pour une couverture totale.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
      pricing_type: 'fixed',
      price: 1500,
      status: 'available',
      featured: true,
      created_at: new Date(Date.now() - 3000000).toISOString(),
      updated_at: new Date(Date.now() - 1000000).toISOString()
    },
    {
      id: 'video-surveillance',
      name: 'Vidéosurveillance',
      category: 'Sécurité',
      description: 'Installation de systèmes de vidéosurveillance intelligents pour la sécurité de votre maison ou entreprise.',
      image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb',
      pricing_type: 'quote',
      status: 'available',
      featured: false,
      created_at: new Date(Date.now() - 5000000).toISOString(),
      updated_at: new Date(Date.now() - 2000000).toISOString()
    },
    {
      id: 'it-maintenance',
      name: 'Maintenance Informatique',
      category: 'Support',
      description: 'Maintenance régulière de vos équipements informatiques et réseaux pour garantir une performance optimale.',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780',
      pricing_type: 'fixed',
      price: 800,
      status: 'available',
      featured: true,
      created_at: new Date(Date.now() - 7000000).toISOString(),
      updated_at: new Date(Date.now() - 3000000).toISOString()
    }
  ];
  
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
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockServices;
    }
  
    const servicesCollection = collection(db, 'services');
    const servicesSnapshot = await getDocs(servicesCollection);
    return servicesSnapshot.docs.map(convertService);
  };
  
  // Get available services
  export const getAvailableServices = async (): Promise<Service[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockServices.filter(service => service.status === 'available');
    }
  
    const servicesCollection = collection(db, 'services');
    const q = query(servicesCollection, where('status', '==', 'available'));
    const servicesSnapshot = await getDocs(q);
    return servicesSnapshot.docs.map(convertService);
  };
  
  // Get featured services
  export const getFeaturedServices = async (): Promise<Service[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockServices.filter(service => service.featured);
    }
  
    const servicesCollection = collection(db, 'services');
    const q = query(servicesCollection, where('featured', '==', true));
    const servicesSnapshot = await getDocs(q);
    return servicesSnapshot.docs.map(convertService);
  };
  
  // Get service by ID
  export const getServiceById = async (id: string): Promise<Service | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockServices.find(service => service.id === id) || null;
    }
  
    const serviceDoc = await getDoc(doc(db, 'services', id));
    if (!serviceDoc.exists()) return null;
    return convertService(serviceDoc);
  };
  
  // Create service
  export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Create service operation not available in demo mode");
      return "demo-service-id";
    }
  
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
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Update service operation not available in demo mode");
      return;
    }
  
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      ...service,
      updated_at: serverTimestamp()
    });
  };
  
  // Delete service
  export const deleteService = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Delete service operation not available in demo mode");
      return;
    }
  
    await deleteDoc(doc(db, 'services', id));
  };
  
  // Upload service image
  export const uploadServiceImage = async (file: File, serviceId: string): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Upload image operation not available in demo mode");
      return "https://via.placeholder.com/300";
    }
  
    const storageRef = ref(storage, `services/${serviceId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };