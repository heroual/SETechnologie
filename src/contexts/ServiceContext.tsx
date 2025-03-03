import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service } from '../types';
import { subscribeToServices, getServices } from '../services/serviceService';

interface ServiceContextType {
  services: Service[];
  loading: boolean;
  error: string | null;
  refreshServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchServices = async () => {
      try {
        setLoading(true);
        const initialServices = await getServices();
        setServices(initialServices);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Set up real-time listener
    const unsubscribe = subscribeToServices((updatedServices) => {
      setServices(updatedServices);
      setLoading(false);
      setError(null);
    });

    // Clean up listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshServices = async () => {
    try {
      setLoading(true);
      const refreshedServices = await getServices();
      setServices(refreshedServices);
      setError(null);
    } catch (err) {
      console.error('Error refreshing services:', err);
      setError('Failed to refresh services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider value={{ services, loading, error, refreshServices }}>
      {children}
    </ServiceContext.Provider>
  );
};