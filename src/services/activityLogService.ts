import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    limit, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db, isDemoMode } from '../lib/firebase';
  
  interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: any;
    timestamp: string;
  }
  
  // Mock activity logs for demo mode
  const mockActivityLogs: ActivityLog[] = [
    {
      id: 'log1',
      userId: 'admin-user',
      action: 'create',
      entityType: 'product',
      entityId: 'router-pro-x1',
      timestamp: new Date(Date.now() - 1000000).toISOString()
    },
    {
      id: 'log2',
      userId: 'admin-user',
      action: 'update',
      entityType: 'service',
      entityId: 'wifi-installation',
      timestamp: new Date(Date.now() - 2000000).toISOString()
    },
    {
      id: 'log3',
      userId: 'manager-user',
      action: 'update',
      entityType: 'product',
      entityId: 'camera-360-pro',
      timestamp: new Date(Date.now() - 3000000).toISOString()
    }
  ];
  
  // Log activity
  export const logActivity = async (
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: any
  ): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      console.log("Log activity operation not available in demo mode");
      return "demo-log-id";
    }
  
    const logData = {
      userId,
      action,
      entityType,
      entityId,
      details,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'activity_logs'), logData);
    return docRef.id;
  };
  
  // Get recent activity logs
  export const getRecentActivityLogs = async (count: number = 10): Promise<ActivityLog[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockActivityLogs.slice(0, count);
    }
  
    const logsCollection = collection(db, 'activity_logs');
    const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(count));
    const logsSnapshot = await getDocs(q);
    
    return logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details,
        timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString()
      };
    });
  };