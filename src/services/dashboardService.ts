import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DashboardStats } from '../types';
import { getProducts, getActiveProducts } from './productService';
import { getServices, getAvailableServices } from './serviceService';
import { getRecentActivityLogs } from './activityLogService';

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Get products and services counts
  const products = await getProducts();
  const activeProducts = await getActiveProducts();
  const services = await getServices();
  const availableServices = await getAvailableServices();
  
  // Get recent updates from activity logs
  const recentLogs = await getRecentActivityLogs(5);
  
  const recentUpdates = await Promise.all(
    recentLogs.map(async (log) => {
      let name = '';
      
      if (log.entityType === 'product') {
        const product = await getProducts().then(products => 
          products.find(p => p.id === log.entityId)
        );
        name = product?.name || 'Unknown Product';
      } else if (log.entityType === 'service') {
        const service = await getServices().then(services => 
          services.find(s => s.id === log.entityId)
        );
        name = service?.name || 'Unknown Service';
      }
      
      return {
        id: log.id,
        type: log.entityType as 'product' | 'service',
        action: log.action as 'create' | 'update' | 'delete',
        name,
        timestamp: log.timestamp
      };
    })
  );
  
  return {
    total_products: products.length,
    active_products: activeProducts.length,
    total_services: services.length,
    available_services: availableServices.length,
    recent_updates: recentUpdates
  };
};