import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  Settings,
  Users,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { DashboardStats } from '../../types';
import { getDashboardStats } from '../../services/dashboardService';

const data = [
  { name: 'Jan', products: 4, services: 2 },
  { name: 'Fév', products: 6, services: 3 },
  { name: 'Mar', products: 8, services: 5 },
  { name: 'Avr', products: 10, services: 6 },
  { name: 'Mai', products: 12, services: 8 },
];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  trend: { value: number; isPositive: boolean } 
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
    <p className="text-gray-400 text-sm">{title}</p>
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
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
        />
        <StatCard
          title="Produits Actifs"
          value={stats.active_products}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Services"
          value={stats.total_services}
          icon={Settings}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Services Disponibles"
          value={stats.available_services}
          icon={Users}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Aperçu des Produits et Services</h3>
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
    </div>
  );
};

export default Dashboard;