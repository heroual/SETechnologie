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
  import { ExternalDataSource, ExternalDataPoint } from '../types';
  
  // Mock external data sources for demo mode
  const mockDataSources: ExternalDataSource[] = [
    {
      id: 'source1',
      name: 'Météo Maroc',
      type: 'api',
      url: 'https://api.example.com/weather/morocco',
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      status: 'active',
      refreshInterval: 60,
      credentials: {
        apiKey: 'demo-api-key'
      }
    },
    {
      id: 'source2',
      name: 'Taux de Change',
      type: 'api',
      url: 'https://api.example.com/exchange-rates',
      lastSync: new Date(Date.now() - 7200000).toISOString(),
      status: 'active',
      refreshInterval: 120
    },
    {
      id: 'source3',
      name: 'Actualités Tech',
      type: 'rss',
      url: 'https://example.com/tech-news/feed',
      lastSync: new Date(Date.now() - 14400000).toISOString(),
      status: 'active',
      refreshInterval: 240
    }
  ];
  
  // Mock external data points for demo mode
  const mockDataPoints: ExternalDataPoint[] = [
    {
      id: 'data1',
      sourceId: 'source1',
      name: 'Température Casablanca',
      value: 24,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metadata: {
        unit: '°C',
        condition: 'Ensoleillé'
      }
    },
    {
      id: 'data2',
      sourceId: 'source1',
      name: 'Température Rabat',
      value: 22,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      metadata: {
        unit: '°C',
        condition: 'Partiellement nuageux'
      }
    },
    {
      id: 'data3',
      sourceId: 'source2',
      name: 'EUR/MAD',
      value: 10.85,
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'data4',
      sourceId: 'source2',
      name: 'USD/MAD',
      value: 9.75,
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'data5',
      sourceId: 'source3',
      name: 'Dernière actualité',
      value: 'Les nouvelles technologies IoT révolutionnent le marché marocain',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      metadata: {
        url: 'https://example.com/tech-news/iot-morocco',
        author: 'Tech Magazine'
      }
    }
  ];
  
  // Convert Firestore data to ExternalDataSource type
  const convertDataSource = (doc: any): ExternalDataSource => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      url: data.url,
      lastSync: data.lastSync?.toDate().toISOString() || new Date().toISOString(),
      status: data.status,
      refreshInterval: data.refreshInterval,
      credentials: data.credentials
    };
  };
  
  // Convert Firestore data to ExternalDataPoint type
  const convertDataPoint = (doc: any): ExternalDataPoint => {
    const data = doc.data();
    return {
      id: doc.id,
      sourceId: data.sourceId,
      name: data.name,
      value: data.value,
      timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
      metadata: data.metadata
    };
  };
  
  // Get all external data sources
  export const getExternalDataSources = async (): Promise<ExternalDataSource[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return [...mockDataSources];
    }
  
    const sourcesCollection = collection(db, 'external_data_sources');
    const sourcesSnapshot = await getDocs(sourcesCollection);
    return sourcesSnapshot.docs.map(convertDataSource);
  };
  
  // Get external data source by ID
  export const getExternalDataSourceById = async (id: string): Promise<ExternalDataSource | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockDataSources.find(source => source.id === id) || null;
    }
  
    const sourceDoc = await getDoc(doc(db, 'external_data_sources', id));
    if (!sourceDoc.exists()) return null;
    return convertDataSource(sourceDoc);
  };
  
  // Create external data source
  export const createExternalDataSource = async (source: Omit<ExternalDataSource, 'id' | 'lastSync' | 'status'>): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const newId = `demo-source-${Date.now()}`;
      mockDataSources.push({
        id: newId,
        ...source,
        lastSync: new Date().toISOString(),
        status: 'active'
      });
      return newId;
    }
  
    const sourceData = {
      ...source,
      lastSync: serverTimestamp(),
      status: 'active'
    };
    
    const docRef = await addDoc(collection(db, 'external_data_sources'), sourceData);
    return docRef.id;
  };
  
  // Update external data source
  export const updateExternalDataSource = async (id: string, source: Partial<ExternalDataSource>): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockDataSources.findIndex(s => s.id === id);
      if (index !== -1) {
        mockDataSources[index] = {
          ...mockDataSources[index],
          ...source
        };
      }
      return;
    }
  
    const sourceRef = doc(db, 'external_data_sources', id);
    await updateDoc(sourceRef, source);
  };
  
  // Delete external data source
  export const deleteExternalDataSource = async (id: string): Promise<void> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const index = mockDataSources.findIndex(s => s.id === id);
      if (index !== -1) {
        mockDataSources.splice(index, 1);
        // Also remove associated data points
        const dataPointsToRemove = mockDataPoints.filter(dp => dp.sourceId === id);
        dataPointsToRemove.forEach(dp => {
          const dpIndex = mockDataPoints.findIndex(p => p.id === dp.id);
          if (dpIndex !== -1) {
            mockDataPoints.splice(dpIndex, 1);
          }
        });
      }
      return;
    }
  
    // Delete the source
    await deleteDoc(doc(db, 'external_data_sources', id));
    
    // Delete associated data points
    const dataPointsCollection = collection(db, 'external_data_points');
    const q = query(dataPointsCollection, where('sourceId', '==', id));
    const dataPointsSnapshot = await getDocs(q);
    
    const deletePromises = dataPointsSnapshot.docs.map(dataPointDoc => 
      deleteDoc(doc(db, 'external_data_points', dataPointDoc.id))
    );
    
    await Promise.all(deletePromises);
  };
  
  // Get data points for a specific source
  export const getDataPointsBySource = async (sourceId: string): Promise<ExternalDataPoint[]> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      return mockDataPoints.filter(point => point.sourceId === sourceId);
    }
  
    const dataPointsCollection = collection(db, 'external_data_points');
    const q = query(
      dataPointsCollection, 
      where('sourceId', '==', sourceId),
      orderBy('timestamp', 'desc')
    );
    const dataPointsSnapshot = await getDocs(q);
    return dataPointsSnapshot.docs.map(convertDataPoint);
  };
  
  // Get latest data point for a specific source and name
  export const getLatestDataPoint = async (sourceId: string, name: string): Promise<ExternalDataPoint | null> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const matchingPoints = mockDataPoints
        .filter(point => point.sourceId === sourceId && point.name === name)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return matchingPoints.length > 0 ? matchingPoints[0] : null;
    }
  
    const dataPointsCollection = collection(db, 'external_data_points');
    const q = query(
      dataPointsCollection, 
      where('sourceId', '==', sourceId),
      where('name', '==', name),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    const dataPointsSnapshot = await getDocs(q);
    
    if (dataPointsSnapshot.empty) return null;
    return convertDataPoint(dataPointsSnapshot.docs[0]);
  };
  
  // Create data point
  export const createDataPoint = async (dataPoint: Omit<ExternalDataPoint, 'id' | 'timestamp'>): Promise<string> => {
    // Check if we're using demo configuration
    if (isDemoMode) {
      const newId = `demo-data-point-${Date.now()}`;
      mockDataPoints.push({
        id: newId,
        ...dataPoint,
        timestamp: new Date().toISOString()
      });
      
      // Update lastSync on the source
      const sourceIndex = mockDataSources.findIndex(s => s.id === dataPoint.sourceId);
      if (sourceIndex !== -1) {
        mockDataSources[sourceIndex].lastSync = new Date().toISOString();
      }
      
      return newId;
    }
  
    const dataPointData = {
      ...dataPoint,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'external_data_points'), dataPointData);
    
    // Update lastSync on the source
    const sourceRef = doc(db, 'external_data_sources', dataPoint.sourceId);
    await updateDoc(sourceRef, { lastSync: serverTimestamp() });
    
    return docRef.id;
  };
  
  // Sync data from external source
  export const syncExternalData = async (sourceId: string): Promise<boolean> => {
    try {
      // Check if we're using demo configuration
      if (isDemoMode) {
        // Simulate syncing by updating lastSync
        const sourceIndex = mockDataSources.findIndex(s => s.id === sourceId);
        if (sourceIndex !== -1) {
          mockDataSources[sourceIndex].lastSync = new Date().toISOString();
          
          // For demo purposes, create some random data points
          if (sourceId === 'source1') {
            // Weather data
            await createDataPoint({
              sourceId,
              name: 'Température Casablanca',
              value: 20 + Math.floor(Math.random() * 10),
              metadata: {
                unit: '°C',
                condition: ['Ensoleillé', 'Nuageux', 'Partiellement nuageux'][Math.floor(Math.random() * 3)]
              }
            });
            
            await createDataPoint({
              sourceId,
              name: 'Température Rabat',
              value: 18 + Math.floor(Math.random() * 10),
              metadata: {
                unit: '°C',
                condition: ['Ensoleillé', 'Nuageux', 'Partiellement nuageux'][Math.floor(Math.random() * 3)]
              }
            });
          } else if (sourceId === 'source2') {
            // Exchange rates
            await createDataPoint({
              sourceId,
              name: 'EUR/MAD',
              value: 10.8 + (Math.random() * 0.2 - 0.1)
            });
            
            await createDataPoint({
              sourceId,
              name: 'USD/MAD',
              value: 9.7 + (Math.random() * 0.2 - 0.1)
            });
          }
        }
        
        return true;
      }
  
      // In a real implementation, you would fetch data from the external source
      // and create data points based on the response
      
      // For now, we'll just update the lastSync timestamp
      const sourceRef = doc(db, 'external_data_sources', sourceId);
      await updateDoc(sourceRef, { 
        lastSync: serverTimestamp(),
        status: 'active'
      });
      
      return true;
    } catch (error) {
      console.error('Error syncing external data:', error);
      
      // Update status to error
      if (!isDemoMode) {
        const sourceRef = doc(db, 'external_data_sources', sourceId);
        await updateDoc(sourceRef, { status: 'error' });
      } else {
        const sourceIndex = mockDataSources.findIndex(s => s.id === sourceId);
        if (sourceIndex !== -1) {
          mockDataSources[sourceIndex].status = 'error';
        }
      }
      
      return false;
    }
  };