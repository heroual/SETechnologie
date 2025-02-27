import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    limit, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from '../lib/firebase';
  
  interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: any;
    timestamp: string;
  }
  
  // Log activity
  export const logActivity = async (
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: any
  ): Promise<string> => {
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