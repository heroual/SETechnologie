import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DashboardStats } from '../types';
import { getProducts, getActiveProducts } from './productService';
import { getServices, getAvailableServices } from './serviceService';
import { getRecentActivityLogs } from './activityLogService';

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Check if we're using demo configuration
    if (db.app.options.apiKey === "demo-api-key") {
      // Return mock data for demo mode
      return {
        total_products: 12,
        active_products: 8,
        total_services: 6,
        available_services: 5,
        recent_updates: [
          {
            id: "1",
            type: "product",
            action: "create",
            name: "Router Pro X1",
            timestamp: new Date().toISOString()
          },
          {
            id: "2",
            type: "service",
            action: "update",
            name: "Installation Wi-Fi",
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "3",
            type: "product",
            action: "update",
            name: "Caméra 360° Pro",
            timestamp: new Date(Date.now() - 172800000).toISOString()
          }
        ]
      };
    }

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
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return fallback data in case of error
    return {
      total_products: 0,
      active_products: 0,
      total_services: 0,
      available_services: 0,
      recent_updates: []
    };
  }
};