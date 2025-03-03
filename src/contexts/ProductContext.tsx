import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { subscribeToProducts, getProducts } from '../services/productService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const initialProducts = await getProducts();
        setProducts(initialProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time listener
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
      setError(null);
    });

    // Clean up listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const refreshedProducts = await getProducts();
      setProducts(refreshedProducts);
      setError(null);
    } catch (err) {
      console.error('Error refreshing products:', err);
      setError('Failed to refresh products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};