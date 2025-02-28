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
    serverTimestamp 
  } from 'firebase/firestore';
  import { db, isDemoMode } from '../lib/firebase';
  import { ActionItem, ActionHistory } from '../types';
  import { createNotification } from './notificationService';
  
  // Mock action items for demo mode
  const mockActionItems: ActionItem[] = [
    {
      id: 'action1',
      title: 'Approuver la commande de stock',
      description: 'Commande de 50 unités de Router Pro X1 en attente d\'approbation',
      type: 'approval',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      assignedTo: 'admin-user',
      createdBy: 'system',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      relatedEntityType: 'product',
      relatedEntityId: 'router-pro-x1'
    },
    {
      id: 'action2',
      title: 'Mettre à jour les prix des produits',
      description: 'Mettre à jour les prix des produits suite à la nouvelle politique tarifaire',
      type: 'task',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      assignedTo: 'manager-user',
      createdBy: 'admin-user',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'action3',
      title: 'Vérifier les stocks de Caméra 360° Pro',
      description: 'Le stock est inférieur au seuil minimum. Vérifier et commander si nécessaire.',
      type: 'alert',
      status: 'pending',
      priority: 'critical',
      assignedTo: 'admin-user',
      createdBy: 'system',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      relatedEntityType: 'product',
      relatedEntityId: 'camera-360-pro'
    },
    {
      id: 'action4',
      title: 'Rappel: Réunion mensuelle',
      description: 'Réunion mensuelle de l\'équipe prévue pour demain à 10h00',
      type: 'reminder',
      status: 'pending',
      priority: 'low',
      dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      assignedTo: 'admin-user',
      createdBy: 'admin-user',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];
  
  // Mock action history for demo mode
  const mockActionHistory: ActionHistory[] = [
    {
      id: 'history1',
      actionItemId: 'action2',
      status: 'in_progress',
      comment: 'J\'ai commencé à mettre à jour les prix des produits de la catégorie Réseau',
      performedBy: 'manager-user',
      timestamp: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'history2',
      actionItemId: 'action1',
      status: 'pending',
      comment: 'En attente d\'approbation du budget',
      performedBy: 'system',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  
  // Convert Firestore data to ActionItem type
  const convertActionItem = (doc: any): ActionItem => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate?.toDate().toISOString(),
      assignedTo: data.assignedTo,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      relatedEntityType: data.relatedEntityType,
      relatedEntityId: data.relatedEntityId
    };
  };
  
  // Convert Firestore data to ActionHistory type
  const convertActionHistory = (doc: any): ActionHistory => {
    const data = doc.data();
    return {
      id: doc.id,
      actionItemId: data.actionItemId,
      status: data.status,
      comment: data.comment,
      performedBy: data.performedBy,
      timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString()
    };
  };
  
  // Get all action items
  export const getActionItems = async (): Promise<ActionItem[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return [...mockActionItems].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  
    const actionItemsCollection = collection(db, 'action_items');
    const q = query(actionItemsCollection, orderBy('createdAt', 'desc'));
    const actionItemsSnapshot = await getDocs(q);
    return actionItemsSnapshot.docs.map(convertActionItem);
  };
  
  // Get action items by status
  export const getActionItemsByStatus = async (status: string): Promise<ActionItem[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockActionItems
        .filter(item => item.status === status)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  
    const actionItemsCollection = collection(db, 'action_items');
    const q = query(
      actionItemsCollection, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const actionItemsSnapshot = await getDocs(q);
    return actionItemsSnapshot.docs.map(convertActionItem);
  };
  
  // Get action items by assignee
  export const getActionItemsByAssignee = async (userId: string): Promise<ActionItem[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockActionItems
        .filter(item => item.assignedTo === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  
    const actionItemsCollection = collection(db, 'action_items');
    const q = query(
      actionItemsCollection, 
      where('assignedTo', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const actionItemsSnapshot = await getDocs(q);
    return actionItemsSnapshot.docs.map(convertActionItem);
  };
  
  // Get action items by priority
  export const getActionItemsByPriority = async (priority: string): Promise<ActionItem[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockActionItems
        .filter(item => item.priority === priority)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  
    const actionItemsCollection = collection(db, 'action_items');
    const q = query(
      actionItemsCollection, 
      where('priority', '==', priority),
      orderBy('createdAt', 'desc')
    );
    const actionItemsSnapshot = await getDocs(q);
    return actionItemsSnapshot.docs.map(convertActionItem);
  };
  
  // Get action item by ID
  export const getActionItemById = async (id: string): Promise<ActionItem | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockActionItems.find(item => item.id === id) || null;
    }
  
    const actionItemDoc = await getDoc(doc(db, 'action_items', id));
    if (!actionItemDoc.exists()) return null;
    return convertActionItem(actionItemDoc);
  };
  
  // Create action item
  export const createActionItem = async (
    actionItem: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>,
    sendNotification: boolean = true
  ): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const newId = `demo-action-${Date.now()}`;
      const now = new Date().toISOString();
      
      mockActionItems.push({
        id: newId,
        ...actionItem,
        createdAt: now,
        updatedAt: now
      });
      
      // Create notification if requested
      if (sendNotification) {
        let notificationType: 'info' | 'warning' | 'error' = 'info';
        
        if (actionItem.priority === 'critical') {
          notificationType = 'error';
        } else if (actionItem.priority === 'high') {
          notificationType = 'warning';
        }
        
        await createNotification({
          title: `Nouvelle action: ${actionItem.title}`,
          message: actionItem.description,
          type: notificationType,
          actionable: true,
          actionLink: '/admin/actions',
          actionText: 'Voir les actions',
          category: 'system'
        });
      }
      
      return newId;
    }
  
    const actionItemData = {
      ...actionItem,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'action_items'), actionItemData);
    
    // Create notification if requested
    if (sendNotification) {
      let notificationType: 'info' | 'warning' | 'error' = 'info';
      
      if (actionItem.priority === 'critical') {
        notificationType = 'error';
      } else if (actionItem.priority === 'high') {
        notificationType = 'warning';
      }
      
      await createNotification({
        title: `Nouvelle action: ${actionItem.title}`,
        message: actionItem.description,
        type: notificationType,
        actionable: true,
        actionLink: '/admin/actions',
        actionText: 'Voir les actions',
        category: 'system'
      });
    }
    
    return docRef.id;
  };
  
  // Update action item
  export const updateActionItem = async (
    id: string, 
    actionItem: Partial<ActionItem>,
    comment?: string,
    performedBy?: string
  ): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockActionItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockActionItems[index] = {
          ...mockActionItems[index],
          ...actionItem,
          updatedAt: new Date().toISOString()
        };
        
        // Add to history if status changed and comment provided
        if (actionItem.status && comment && performedBy) {
          const historyId = `demo-history-${Date.now()}`;
          mockActionHistory.push({
            id: historyId,
            actionItemId: id,
            status: actionItem.status,
            comment,
            performedBy,
            timestamp: new Date().toISOString()
          });
        }
      }
      return;
    }
  
    const actionItemRef = doc(db, 'action_items', id);
    
    await updateDoc(actionItemRef, {
      ...actionItem,
      updatedAt: serverTimestamp()
    });
    
    // Add to history if status changed and comment provided
    if (actionItem.status && comment && performedBy) {
      await addDoc(collection(db, 'action_history'), {
        actionItemId: id,
        status: actionItem.status,
        comment,
        performedBy,
        timestamp: serverTimestamp()
      });
    }
  };
  
  // Delete action item
  export const deleteActionItem = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockActionItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockActionItems.splice(index, 1);
        
        // Remove associated history
        const historyToRemove = mockActionHistory.filter(h => h.actionItemId === id);
        historyToRemove.forEach(h => {
          const historyIndex = mockActionHistory.findIndex(item => item.id === h.id);
          if (historyIndex !== -1) {
            mockActionHistory.splice(historyIndex, 1);
          }
        });
      }
      return;
    }
  
    // Delete the action item
    await deleteDoc(doc(db, 'action_items', id));
    
    // Delete associated history
    const historyCollection = collection(db, 'action_history');
    const q = query(historyCollection, where('actionItemId', '==', id));
    const historySnapshot = await getDocs(q);
    
    const deletePromises = historySnapshot.docs.map(historyDoc => 
      deleteDoc(doc(db, 'action_history', historyDoc.id))
    );
    
    await Promise.all(deletePromises);
  };
  
  // Get action history for an item
  export const getActionHistory = async (actionItemId: string): Promise<ActionHistory[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockActionHistory
        .filter(history => history.actionItemId === actionItemId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  
    const historyCollection = collection(db, 'action_history');
    const q = query(
      historyCollection, 
      where('actionItemId', '==', actionItemId),
      orderBy('timestamp', 'desc')
    );
    const historySnapshot = await getDocs(q);
    return historySnapshot.docs.map(convertActionHistory);
  };
  
  // Add action history entry
  export const addActionHistory = async (
    actionItemId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'rejected',
    comment: string,
    performedBy: string
  ): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const newId = `demo-history-${Date.now()}`;
      mockActionHistory.push({
        id: newId,
        actionItemId,
        status,
        comment,
        performedBy,
        timestamp: new Date().toISOString()
      });
      
      // Update action item status
      const actionIndex = mockActionItems.findIndex(item => item.id === actionItemId);
      if (actionIndex !== -1) {
        mockActionItems[actionIndex].status = status;
        mockActionItems[actionIndex].updatedAt = new Date().toISOString();
      }
      
      return newId;
    }
  
    const historyData = {
      actionItemId,
      status,
      comment,
      performedBy,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'action_history'), historyData);
    
    // Update action item status
    const actionItemRef = doc(db, 'action_items', actionItemId);
    await updateDoc(actionItemRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  };
  
  // Create approval action
  export const createApprovalAction = async (
    title: string,
    description: string,
    assignedTo: string,
    createdBy: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    dueDate?: string,
    relatedEntityType?: 'product' | 'service' | 'user' | 'order',
    relatedEntityId?: string
  ): Promise<string> => {
    return createActionItem({
      title,
      description,
      type: 'approval',
      status: 'pending',
      priority,
      dueDate,
      assignedTo,
      createdBy,
      relatedEntityType,
      relatedEntityId
    });
  };
  
  // Create task action
  export const createTaskAction = async (
    title: string,
    description: string,
    assignedTo: string,
    createdBy: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    dueDate?: string,
    relatedEntityType?: 'product' | 'service' | 'user' | 'order',
    relatedEntityId?: string
  ): Promise<string> => {
    return createActionItem({
      title,
      description,
      type: 'task',
      status: 'pending',
      priority,
      dueDate,
      assignedTo,
      createdBy,
      relatedEntityType,
      relatedEntityId
    });
  };
  
  // Create alert action
  export const createAlertAction = async (
    title: string,
    description: string,
    assignedTo: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'high',
    relatedEntityType?: 'product' | 'service' | 'user' | 'order',
    relatedEntityId?: string
  ): Promise<string> => {
    return createActionItem({
      title,
      description,
      type: 'alert',
      status: 'pending',
      priority,
      assignedTo,
      createdBy: 'system',
      relatedEntityType,
      relatedEntityId
    });
  };
  
  // Create reminder action
  export const createReminderAction = async (
    title: string,
    description: string,
    assignedTo: string,
    createdBy: string,
    dueDate: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<string> => {
    return createActionItem({
      title,
      description,
      type: 'reminder',
      status: 'pending',
      priority,
      dueDate,
      assignedTo,
      createdBy
    });
  };