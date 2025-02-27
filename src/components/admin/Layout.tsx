import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  LogOut,
  Bell,
  Cpu,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const [notifications] = React.useState(2); // Example notification count
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/admin' },
    { icon: <Package size={20} />, label: 'Produits', path: '/admin/products' },
    { icon: <Settings size={20} />, label: 'Services', path: '/admin/services' },
    { icon: <Users size={20} />, label: 'Utilisateurs', path: '/admin/users' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentMenuItem = menuItems.find(item => 
      location.pathname === item.path || 
      (item.path !== '/admin' && location.pathname.startsWith(item.path))
    );
    return currentMenuItem?.label || 'Tableau de bord';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: isMobile ? -240 : 0 }}
        animate={{ 
          x: isMobile 
            ? (showMobileMenu ? 0 : -240) 
            : (sidebarCollapsed ? -180 : 0)
        }}
        className={`${isMobile ? 'fixed z-30 h-full' : 'relative'} w-60 bg-black/30 backdrop-blur-xl border-r border-white/10 transition-all duration-300`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Cpu className="h-8 w-8 text-[var(--primary)]" />
            {!sidebarCollapsed && <span className="text-xl font-bold hero-gradient">Admin</span>}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={`absolute bottom-0 ${sidebarCollapsed ? 'w-16' : 'w-60'} p-6 border-t border-white/10`}>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>

        {/* Collapse button */}
        {!isMobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-1/2 -right-3 bg-[var(--primary)] text-white rounded-full p-1 shadow-lg"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </motion.aside>

      {/* Overlay for mobile menu */}
      {isMobile && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed && !isMobile ? 'ml-16' : ''}`}>
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black/30 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="mr-4"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl font-semibold">{getCurrentPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-gray-400 hover:text-white cursor-pointer" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <span className="text-sm font-medium">
                {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;