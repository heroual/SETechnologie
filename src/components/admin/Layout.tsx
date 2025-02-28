import React, { useState } from 'react';
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
  Menu,
  X,
  FileText
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import NotificationCenter from './NotificationCenter';
import { NotificationProvider } from '../../contexts/NotificationContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/admin' },
    { icon: <Package size={20} />, label: 'Produits', path: '/admin/products' },
    { icon: <Settings size={20} />, label: 'Services', path: '/admin/services' },
    { icon: <Users size={20} />, label: 'Utilisateurs', path: '/admin/users' },
    { icon: <FileText size={20} />, label: 'Rapports', path: '/admin/reports' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Tableau de bord';
  };

  // Sidebar for mobile
  const sidebar = (
    <>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Cpu className="h-8 w-8 text-[var(--primary)]" />
          <span className="text-xl font-bold hero-gradient">Admin</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col md:flex-row">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar for desktop */}
        <motion.aside
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          className="hidden md:block w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 h-screen sticky top-0"
        >
          {sidebar}
        </motion.aside>

        {/* Mobile sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 left-0 h-screen w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 md:hidden"
        >
          {sidebar}
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-white/10 bg-black/30 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center">
              <button 
                className="mr-4 p-1 rounded-md hover:bg-white/10 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl font-semibold">{getCurrentPageTitle()}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;