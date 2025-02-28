export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  seo_keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  pricing_type: 'fixed' | 'quote';
  price?: number;
  status: 'available' | 'unavailable';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  created_at: string;
}

export interface DashboardStats {
  total_products: number;
  active_products: number;
  total_services: number;
  available_services: number;
  recent_updates: Array<{
    id: string;
    type: 'product' | 'service';
    action: 'create' | 'update' | 'delete';
    name: string;
    timestamp: string;
  }>;
}

export interface AdvancedAnalytics {
  // Sales Analytics
  total_revenue: number;
  monthly_revenue: number[];
  revenue_growth: number;
  average_order_value: number;
  
  // User Engagement
  total_users: number;
  active_users: number;
  user_growth: number;
  page_views: number;
  
  // Performance Metrics
  conversion_rate: number;
  top_products: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  inventory_health: number;
  service_utilization: number;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  seo_keywords: string[];
}

export interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  pricing_type: 'fixed' | 'quote';
  price?: number;
  status: 'available' | 'unavailable';
  featured: boolean;
}

export interface DashboardView {
  id: string;
  name: string;
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: number;
  size: 'small' | 'medium' | 'large' | 'full';
  visible: boolean;
  expanded?: boolean;
  settings?: Record<string, any>;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: ReportField[];
  createdAt?: string;
}

export interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'chart' | 'table';
  source: string;
  width: 'full' | 'half' | 'third';
}

export interface ScheduledReport {
  id: string;
  templateId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  nextRun: string;
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  createdAt: string;
}

export interface ReportData {
  timestamp: string;
  stats: DashboardStats | null;
  analytics: AdvancedAnalytics | null;
  products: any[] | null;
  services: any[] | null;
  users: any[] | null;
}

// Notification System Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionable: boolean;
  actionLink?: string;
  actionText?: string;
  timestamp: string;
  category: 'system' | 'inventory' | 'sales' | 'security' | 'user';
}

// External Data Source Types
export interface ExternalDataSource {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'rss' | 'custom';
  url: string;
  lastSync: string;
  status: 'active' | 'error' | 'pending';
  refreshInterval: number; // in minutes
  credentials?: {
    apiKey?: string;
    username?: string;
    // Other credential types as needed
  };
}

export interface ExternalDataPoint {
  id: string;
  sourceId: string;
  name: string;
  value: any;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Action Center Types
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: 'approval' | 'task' | 'alert' | 'reminder';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  relatedEntityType?: 'product' | 'service' | 'user' | 'order';
  relatedEntityId?: string;
}

export interface ActionHistory {
  id: string;
  actionItemId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  comment?: string;
  performedBy: string;
  timestamp: string;
}

// Shop Settings Types
export interface ShopSettings {
  general: {
    shopName: string;
    shopEmail: string;
    shopPhone: string;
    shopAddress: string;
    shopCurrency: string;
    shopLanguage: string;
  };
  shipping: {
    enableShipping: boolean;
    shippingMethods: Array<{
      id: string;
      name: string;
      price: number;
      estimatedDelivery: string;
      active: boolean;
    }>;
    freeShippingThreshold: number;
  };
  payment: {
    enablePayments: boolean;
    paymentMethods: Array<{
      id: string;
      name: string;
      description: string;
      active: boolean;
    }>;
    taxRate: number;
  };
  emails: {
    sendOrderConfirmation: boolean;
    sendShippingConfirmation: boolean;
    sendOrderCancellation: boolean;
    ccAdminOnOrders: boolean;
  };
}

// Email Settings Types
export interface EmailSettings {
  sender: string;
  replyTo: string;
  bcc: string[];
  signature: string;
  logo: boolean;
  footerText: string;
  templates: Array<{
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
    lastUpdated: string;
  }>;
}

// General Settings Types
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  logo: string;
  favicon: string;
  metaTags: {
    keywords: string;
    author: string;
    ogImage: string;
  };
}