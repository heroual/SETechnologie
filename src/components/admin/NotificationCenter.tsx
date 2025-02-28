import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Trash,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { Notification } from '../../types';

const NotificationItem: React.FC<{ 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    if (notification.read) return 'bg-white/5';
    
    switch (notification.type) {
      case 'info':
        return 'bg-blue-500/10';
      case 'success':
        return 'bg-green-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'error':
        return 'bg-red-500/10';
      default:
        return 'bg-white/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={`p-4 rounded-lg mb-2 ${getBgColor()} hover:bg-white/10 transition-colors relative group`}
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium">{notification.title}</h4>
            <span className="text-xs text-gray-400">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
          
          {notification.actionable && (
            <div className="mt-2">
              <Link 
                to={notification.actionLink || '#'} 
                className="text-xs text-[var(--primary)] hover:underline flex items-center"
              >
                {notification.actionText || 'Voir détails'}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            title="Marquer comme lu"
          >
            <Check className="h-4 w-4 text-green-400" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          title="Supprimer"
        >
          <Trash className="h-4 w-4 text-red-400" />
        </button>
      </div>
    </motion.div>
  );
};

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A0A0F] border border-white/10 rounded-xl shadow-lg z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'border-b-2 border-[var(--primary)] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'unread'
                    ? 'border-b-2 border-[var(--primary)] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Non lues {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
                </div>
              ) : filteredNotifications.length > 0 ? (
                <AnimatePresence>
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>Aucune notification {activeTab === 'unread' ? 'non lue' : ''}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between p-4 border-t border-white/10">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-300 hover:text-white flex items-center"
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4 mr-1" />
                Tout marquer comme lu
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-300 hover:text-white flex items-center"
                disabled={notifications.length === 0}
              >
                <Trash className="h-4 w-4 mr-1" />
                Tout effacer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;