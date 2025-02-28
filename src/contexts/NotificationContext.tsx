import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/notificationService';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Erreur lors de la mise à jour de la notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Erreur lors de la mise à jour des notifications');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Erreur lors de la suppression de la notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(notifications.map(n => deleteNotification(n.id)));
      setNotifications([]);
      toast.success('Toutes les notifications ont été supprimées');
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      toast.error('Erreur lors de la suppression des notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 5 minutes
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification: handleDeleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};