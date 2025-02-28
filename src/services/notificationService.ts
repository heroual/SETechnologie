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
    orderBy, 
    limit, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db, isDemoMode } from '../lib/firebase';
  import { Notification } from '../types';
  
  // Mock notifications for demo mode
  const mockNotifications: Notification[] = [
    {
      id: 'notif1',
      title: 'Stock faible',
      message: 'Le produit "Router Pro X1" a un stock inférieur à 10 unités.',
      type: 'warning',
      read: false,
      actionable: true,
      actionLink: '/admin/products',
      actionText: 'Gérer le stock',
      timestamp: new Date(Date.now() - 1000000).toISOString(),
      category: 'inventory'
    },
    {
      id: 'notif2',
      title: 'Nouveau rapport disponible',
      message: 'Le rapport mensuel des ventes a été généré et est prêt à être consulté.',
      type: 'info',
      read: false,
      actionable: true,
      actionLink: '/admin/reports',
      actionText: 'Voir le rapport',
      timestamp: new Date(Date.now() - 2000000).toISOString(),
      category: 'sales'
    },
    {
      id: 'notif3',
      title: 'Mise à jour système',
      message: 'Une mise à jour du système est prévue pour le 15/04/2025 à 22h00.',
      type: 'info',
      read: true,
      actionable: false,
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      category: 'system'
    },
    {
      id: 'notif4',
      title: 'Tentative de connexion suspecte',
      message: 'Une tentative de connexion depuis une nouvelle localisation a été détectée.',
      type: 'error',
      read: false,
      actionable: true,
      actionLink: '/admin/security',
      actionText: 'Vérifier',
      timestamp: new Date(Date.now() - 4000000).toISOString(),
      category: 'security'
    },
    {
      id: 'notif5',
      title: 'Objectif de vente atteint',
      message: 'Félicitations ! L\'objectif de vente mensuel a été atteint.',
      type: 'success',
      read: true,
      actionable: false,
      timestamp: new Date(Date.now() - 5000000).toISOString(),
      category: 'sales'
    }
  ];
  
  // Convert Firestore data to Notification type
  const convertNotification = (doc: any): Notification => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      message: data.message,
      type: data.type,
      read: data.read,
      actionable: data.actionable,
      actionLink: data.actionLink,
      actionText: data.actionText,
      timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
      category: data.category
    };
  };
  
  // Get all notifications
  export const getNotifications = async (): Promise<Notification[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return [...mockNotifications].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  
    const notificationsCollection = collection(db, 'notifications');
    const q = query(notificationsCollection, orderBy('timestamp', 'desc'));
    const notificationsSnapshot = await getDocs(q);
    return notificationsSnapshot.docs.map(convertNotification);
  };
  
  // Get unread notifications
  export const getUnreadNotifications = async (): Promise<Notification[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockNotifications
        .filter(notification => !notification.read)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  
    const notificationsCollection = collection(db, 'notifications');
    const q = query(
      notificationsCollection, 
      where('read', '==', false),
      orderBy('timestamp', 'desc')
    );
    const notificationsSnapshot = await getDocs(q);
    return notificationsSnapshot.docs.map(convertNotification);
  };
  
  // Get notifications by category
  export const getNotificationsByCategory = async (category: string): Promise<Notification[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockNotifications
        .filter(notification => notification.category === category)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  
    const notificationsCollection = collection(db, 'notifications');
    const q = query(
      notificationsCollection, 
      where('category', '==', category),
      orderBy('timestamp', 'desc')
    );
    const notificationsSnapshot = await getDocs(q);
    return notificationsSnapshot.docs.map(convertNotification);
  };
  
  // Create notification
  export const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const newId = `demo-notification-${Date.now()}`;
      mockNotifications.push({
        id: newId,
        ...notification,
        read: false,
        timestamp: new Date().toISOString()
      });
      return newId;
    }
  
    const notificationData = {
      ...notification,
      read: false,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  };
  
  // Mark notification as read
  export const markNotificationAsRead = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications[index].read = true;
      }
      return;
    }
  
    const notificationRef = doc(db, 'notifications', id);
    await updateDoc(notificationRef, { read: true });
  };
  
  // Delete notification
  export const deleteNotification = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
      }
      return;
    }
  
    await deleteDoc(doc(db, 'notifications', id));
  };
  
  // Create system notification
  export const createSystemNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionable: boolean = false,
    actionLink?: string,
    actionText?: string
  ): Promise<string> => {
    return createNotification({
      title,
      message,
      type,
      actionable,
      actionLink,
      actionText,
      category: 'system'
    });
  };
  
  // Create inventory notification
  export const createInventoryNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'warning',
    actionable: boolean = true,
    actionLink: string = '/admin/products',
    actionText: string = 'Gérer le stock'
  ): Promise<string> => {
    return createNotification({
      title,
      message,
      type,
      actionable,
      actionLink,
      actionText,
      category: 'inventory'
    });
  };
  
  // Create sales notification
  export const createSalesNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionable: boolean = false,
    actionLink?: string,
    actionText?: string
  ): Promise<string> => {
    return createNotification({
      title,
      message,
      type,
      actionable,
      actionLink,
      actionText,
      category: 'sales'
    });
  };
  
  // Create security notification
  export const createSecurityNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'error',
    actionable: boolean = true,
    actionLink: string = '/admin/security',
    actionText: string = 'Vérifier'
  ): Promise<string> => {
    return createNotification({
      title,
      message,
      type,
      actionable,
      actionLink,
      actionText,
      category: 'security'
    });
  };