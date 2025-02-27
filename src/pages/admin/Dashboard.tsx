import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  Settings,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import type { DashboardStats } from '../../types';
import { getDashboardStats } from '../../services/dashboardService';
import { getProducts } from '../../services/productService';
import { getServices } from '../../services/serviceService';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Jan', products: 4, services: 2 },
  { name: 'Fév', products: 6, services: 3 },
  { name: 'Mar', products: 8, services: 5 },
  { name: 'Avr', products: 10, services: 6 },
  { name: 'Mai', products: 12, services: 8 },
  { name: 'Juin', products: 15, services: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  linkTo
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  trend: { value: number; isPositive: boolean };
  linkTo?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-effect rounded-xl p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 rounded-lg bg-[var(--primary)]/20">
        <Icon className="h-6 w-6 text-[var(--primary)]" />
      </div>
      <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {trend.isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span className="text-sm ml-1">{trend.value}%</span>
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-1">{value}</h3>
    <div className="flex items-center justify-between">
      <p className="text-gray-400 text-sm">{title}</p>
      {linkTo && (
        <Link to={linkTo} className="text-[var(--primary)] text-sm hover:underline">
          Voir
        </Link>
      )}
    </div>
  </motion.div>
);

const RecentActivity = ({ recentUpdates }: { recentUpdates: DashboardStats['recent_updates'] }) => (
  <div className="glass-effect rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">Activité Récente</h3>
      <Activity className="h-5 w-5 text-[var(--primary)]" />
    </div>
    <div className="space-y-4">
      {recentUpdates.length > 0 ? (
        recentUpdates.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
          >
            <div>
              <p className="font-medium">
                {activity.action === 'create' ? 'Nouveau' : activity.action === 'update' ? 'Mis à jour' : 'Supprimé'} {activity.type}
              </p>
              <p className="text-sm text-gray-400">{activity.name}</p>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-400">
          Aucune activité récente
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    active_products: 0,
    total_services: 0,
    available_services: 0,
    recent_updates: []
  });
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch additional data for charts
        const products = await getProducts();
        const services = await getServices();
        
        // Process category data
        const categoryCount: Record<string, number> = {};
        products.forEach(product => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        
        const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({
          name,
          value
        }));
        setCategoryData(categoryChartData);
        
        // Process status data
        const activeProducts = products.filter(p => p.status === 'active').length;
        const inactiveProducts = products.filter(p => p.status === 'inactive').length;
        const availableServices = services.filter(s => s.status === 'available').length;
        const unavailableServices = services.filter(s => s.status === 'unavailable').length;
        
        setStatusData([
          { name: 'Produits actifs', value: activeProducts },
          { name: 'Produits inactifs', value: inactiveProducts },
          { name: 'Services disponibles', value: availableServices },
          { name: 'Services indisponibles', value: unavailableServices }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Produits"
          value={stats.total_products}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          linkTo="/admin/products"
        />
        <StatCard
          title="Produits Actifs"
          value={stats.active_products}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          linkTo="/admin/products"
        />
        <StatCard
          title="Total Services"
          value={stats.total_services}
          icon={Settings}
          trend={{ value: 5, isPositive: true }}
          linkTo="/admin/services"
        />
        <StatCard
          title="Services Disponibles"
          value={stats.available_services}
          icon={Users}
          trend={{ value: 3, isPositive: false }}
          linkTo="/admin/services"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products" state={{ showForm: true }}>
            <button className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Nouveau Produit
            </button>
          </Link>
          <Link to="/admin/services" state={{ showForm: true }}>
            <button className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Nouveau Service
            </button>
          </Link>
          <Link to="/admin/users">
            <button className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
              <Users className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Gérer Utilisateurs
            </button>
          </Link>
          <Link to="/">
            <button className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
              <Eye className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Voir le Site
            </button>
          </Link>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Évolution des Produits et Services</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="products" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="services" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="products"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#products)"
                />
                <Area
                  type="monotone"
                  dataKey="services"
                  stroke="var(--secondary)"
                  fillOpacity={1}
                  fill="url(#services)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <RecentActivity recentUpdates={stats.recent_updates} />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Distribution */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Distribution par Catégorie</h3>
          <div className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Statut des Produits et Services</h3>
          <div className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;