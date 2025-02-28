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
  Eye,
  DollarSign,
  BarChart2,
  ShoppingBag,
  Percent,
  Award,
  AlertTriangle,
  Zap
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
  Legend,
  LineChart,
  Line
} from 'recharts';
import type { DashboardStats, AdvancedAnalytics } from '../../types';
import { getDashboardStats, getAdvancedAnalytics } from '../../services/dashboardService';
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
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  linkTo
}: { 
  title: string; 
  value: number | string; 
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

const TopProductsTable = ({ topProducts }: { topProducts: AdvancedAnalytics['top_products'] }) => (
  <div className="glass-effect rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">Produits les plus vendus</h3>
      <Award className="h-5 w-5 text-[var(--primary)]" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 font-medium text-gray-400">Produit</th>
            <th className="text-right py-2 font-medium text-gray-400">Ventes</th>
            <th className="text-right py-2 font-medium text-gray-400">Revenus</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((product, index) => (
            <tr key={product.id} className="border-b border-white/10 last:border-0">
              <td className="py-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mr-2">
                    {index + 1}
                  </div>
                  <span>{product.name}</span>
                </div>
              </td>
              <td className="py-3 text-right">{product.sales}</td>
              <td className="py-3 text-right">{product.revenue.toLocaleString()} MAD</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PerformanceIndicator = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  suffix
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) => (
  <div className="glass-effect rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className={`p-2 rounded-lg bg-${color}-500/20`}>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
    </div>
    <div className="flex items-end">
      <span className="text-2xl font-bold">{value}</span>
      {suffix && <span className="text-gray-400 ml-1">{suffix}</span>}
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
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch basic dashboard stats
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
        
        // Fetch advanced analytics
        const advancedAnalytics = await getAdvancedAnalytics();
        setAnalytics(advancedAnalytics);
        
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
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare revenue data for chart
  const revenueData = analytics ? 
    analytics.monthly_revenue.map((value, index) => ({
      name: MONTHS[index],
      revenue: value
    })) : [];

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

      {/* Sales Analytics Section */}
      {analytics && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Analyse des Ventes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Revenu Total"
              value={`${analytics.total_revenue.toLocaleString()} MAD`}
              icon={DollarSign}
              trend={{ value: analytics.revenue_growth, isPositive: analytics.revenue_growth > 0 }}
            />
            <StatCard
              title="Valeur Moyenne Commande"
              value={`${analytics.average_order_value.toLocaleString()} MAD`}
              icon={ShoppingBag}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Taux de Conversion"
              value={`${analytics.conversion_rate}%`}
              icon={Percent}
              trend={{ value: 2, isPositive: true }}
            />
          </div>
          
          {/* Revenue Chart */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-6">Évolution du Revenu Mensuel</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
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
                    formatter={(value: any) => [`${value.toLocaleString()} MAD`, 'Revenu']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* User Engagement Section */}
      {analytics && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Engagement Utilisateurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Utilisateurs Totaux"
              value={analytics.total_users}
              icon={Users}
              trend={{ value: analytics.user_growth, isPositive: analytics.user_growth > 0 }}
            />
            <StatCard
              title="Utilisateurs Actifs"
              value={analytics.active_users}
              icon={Zap}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Pages Vues"
              value={analytics.page_views.toLocaleString()}
              icon={Eye}
              trend={{ value: 12, isPositive: true }}
            />
          </div>
        </div>
      )}

      {/* Performance Metrics Section */}
      {analytics && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Indicateurs de Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-6">
              <PerformanceIndicator
                title="Santé Inventaire"
                value={analytics.inventory_health}
                icon={Package}
                color="blue"
                suffix="%"
              />
              <PerformanceIndicator
                title="Utilisation Services"
                value={analytics.service_utilization}
                icon={Settings}
                color="green"
                suffix="%"
              />
            </div>
            
            <TopProductsTable topProducts={analytics.top_products} />
          </div>
        </div>
      )}

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