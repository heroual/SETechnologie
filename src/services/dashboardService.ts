import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db, isDemoMode } from '../lib/firebase';
import { DashboardStats, AdvancedAnalytics } from '../types';
import { getProducts, getActiveProducts } from './productService';
import { getServices, getAvailableServices } from './serviceService';
import { getRecentActivityLogs } from './activityLogService';

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Check if we're using demo configuration
    if (isDemoMode) {
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

// Get advanced analytics data
export const getAdvancedAnalytics = async (): Promise<AdvancedAnalytics> => {
  try {
    // Check if we're using demo configuration
    if (isDemoMode) {
      // Generate realistic mock data for demo mode
      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        // Create a realistic revenue pattern with growth trend and seasonal variations
        const baseRevenue = 50000 + (i * 5000); // Base growth trend
        const seasonalFactor = 1 + Math.sin((i / 11) * Math.PI) * 0.3; // Seasonal variation
        const randomFactor = 0.9 + (Math.random() * 0.2); // Random variation ±10%
        return Math.round(baseRevenue * seasonalFactor * randomFactor);
      });
      
      // Calculate revenue growth (comparing current month to previous)
      const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1];
      const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2];
      const revenueGrowth = Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);
      
      return {
        // Sales Analytics
        total_revenue: monthlyRevenue.reduce((sum, revenue) => sum + revenue, 0),
        monthly_revenue: monthlyRevenue,
        revenue_growth: revenueGrowth,
        average_order_value: 1250,
        
        // User Engagement
        total_users: 850,
        active_users: 320,
        user_growth: 15,
        page_views: 12500,
        
        // Performance Metrics
        conversion_rate: 3.2,
        top_products: [
          {
            id: 'router-pro-x1',
            name: 'Router Pro X1',
            sales: 48,
            revenue: 62352
          },
          {
            id: 'camera-360-pro',
            name: 'Caméra 360° Pro',
            sales: 36,
            revenue: 32364
          },
          {
            id: 'smart-lock-pro',
            name: 'Smart Lock Pro',
            sales: 29,
            revenue: 23171
          },
          {
            id: 'mesh-wifi-system',
            name: 'Système Mesh Wi-Fi',
            sales: 22,
            revenue: 32978
          }
        ],
        inventory_health: 78,
        service_utilization: 65
      };
    }

    // In a real implementation, you would fetch this data from your database
    // For now, we'll return mock data similar to the demo mode
    const products = await getProducts();
    
    // Calculate total potential revenue from all products
    const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    
    // Generate monthly revenue data (mock data for now)
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const baseRevenue = totalRevenue / 24 + (i * totalRevenue / 240);
      const seasonalFactor = 1 + Math.sin((i / 11) * Math.PI) * 0.3;
      const randomFactor = 0.9 + (Math.random() * 0.2);
      return Math.round(baseRevenue * seasonalFactor * randomFactor);
    });
    
    // Calculate revenue growth
    const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1];
    const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2];
    const revenueGrowth = previousMonthRevenue ? 
      Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100) : 0;
    
    // Generate top products based on stock value
    const topProducts = products
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name,
        sales: Math.round(product.stock * 0.3), // Assuming 30% of stock has been sold
        revenue: Math.round(product.price * product.stock * 0.3)
      }));
    
    // Calculate inventory health (percentage of products with adequate stock)
    const productsWithAdequateStock = products.filter(product => product.stock > 10).length;
    const inventoryHealth = Math.round((productsWithAdequateStock / products.length) * 100);
    
    return {
      // Sales Analytics
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
      revenue_growth: revenueGrowth,
      average_order_value: Math.round(totalRevenue / 100), // Assuming 100 orders
      
      // User Engagement (mock data for now)
      total_users: 500,
      active_users: 200,
      user_growth: 10,
      page_views: 8000,
      
      // Performance Metrics
      conversion_rate: 2.5,
      top_products: topProducts,
      inventory_health: inventoryHealth,
      service_utilization: 60 // Mock data
    };
  } catch (error) {
    console.error("Error fetching advanced analytics:", error);
    // Return fallback data in case of error
    return {
      total_revenue: 0,
      monthly_revenue: Array(12).fill(0),
      revenue_growth: 0,
      average_order_value: 0,
      total_users: 0,
      active_users: 0,
      user_growth: 0,
      page_views: 0,
      conversion_rate: 0,
      top_products: [],
      inventory_health: 0,
      service_utilization: 0
    };
  }
};