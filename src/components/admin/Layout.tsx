import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  LogOut,
  Bell,
  Cpu
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [notifications] = React.useState(2); // Example notification count

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/admin' },
    { icon: <Package size={20} />, label: 'Produits', path: '/admin/products' },
    { icon: <Settings size={20} />, label: 'Services', path: '/admin/services' },
    { icon: <Users size={20} />, label: 'Utilisateurs', path: '/admin/users' },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10"
      >
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

        <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black/30 backdrop-blur-xl flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Tableau de bord</h1>
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
              <span className="text-sm font-medium">AD</span>
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