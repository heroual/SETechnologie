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