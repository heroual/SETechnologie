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
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
  import { db, storage, isDemoMode } from '../lib/firebase';
  import { Service, ServiceFormData } from '../types';
  import { logActivity } from './activityLogService';
  
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
  export const createService = async (
    serviceData: ServiceFormData, 
    file?: File,
    userId?: string
  ): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const newId = `demo-service-${Date.now()}`;
      mockServices.push({
        id: newId,
        ...serviceData,
        image: file ? 'https://via.placeholder.com/300' : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return newId;
    }
  
    // Create service document first
    const serviceData2 = {
      ...serviceData,
      image: '',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'services'), serviceData2);
    const serviceId = docRef.id;
    
    // Upload image if any
    if (file) {
      const imageUrl = await uploadServiceImage(file, serviceId);
      
      // Update service with image URL
      await updateDoc(docRef, { image: imageUrl });
    }
    
    // Log activity
    if (userId) {
      await logActivity(
        userId,
        'create',
        'service',
        serviceId,
        { name: serviceData.name }
      );
    }
    
    return serviceId;
  };
  
  // Update service
  export const updateService = async (
    id: string, 
    serviceData: ServiceFormData, 
    file?: File,
    userId?: string
  ): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockServices.findIndex(s => s.id === id);
      if (index !== -1) {
        mockServices[index] = {
          ...mockServices[index],
          ...serviceData,
          updated_at: new Date().toISOString()
        };
        
        // Update image if any
        if (file) {
          mockServices[index].image = 'https://via.placeholder.com/300';
        }
      }
      return;
    }
  
    const serviceRef = doc(db, 'services', id);
    
    // Get current service to check existing image
    const serviceDoc = await getDoc(serviceRef);
    if (!serviceDoc.exists()) {
      throw new Error('Service not found');
    }
    
    // Upload new image if any
    let imageUrl = serviceDoc.data().image || '';
    if (file) {
      // Delete old image if exists
      if (imageUrl) {
        try {
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
        } catch (error) {
          console.error('Error deleting old image:', error);
          // Continue with update even if image deletion fails
        }
      }
      
      // Upload new image
      imageUrl = await uploadServiceImage(file, id);
    }
    
    // Update service
    await updateDoc(serviceRef, {
      ...serviceData,
      image: imageUrl,
      updated_at: serverTimestamp()
    });
    
    // Log activity
    if (userId) {
      await logActivity(
        userId,
        'update',
        'service',
        id,
        { name: serviceData.name }
      );
    }
  };
  
  // Delete service
  export const deleteService = async (id: string, userId?: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockServices.findIndex(s => s.id === id);
      if (index !== -1) {
        const deletedService = mockServices[index];
        mockServices.splice(index, 1);
        
        // Log activity
        console.log(`Service ${deletedService.name} deleted in demo mode`);
      }
      return;
    }
  
    // Get service to delete
    const serviceRef = doc(db, 'services', id);
    const serviceDoc = await getDoc(serviceRef);
    
    if (!serviceDoc.exists()) {
      throw new Error('Service not found');
    }
    
    const service = serviceDoc.data();
    
    // Delete image from storage if exists
    if (service.image) {
      try {
        const storageRef = ref(storage, service.image);
        await deleteObject(storageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with deletion even if image deletion fails
      }
    }
    
    // Delete service document
    await deleteDoc(serviceRef);
    
    // Log activity
    if (userId) {
      await logActivity(
        userId,
        'delete',
        'service',
        id,
        { name: service.name }
      );
    }
  };
  
  // Upload service image
  export const uploadServiceImage = async (file: File, serviceId: string): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return "https://via.placeholder.com/300";
    }
  
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `services/${serviceId}/${fileName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };