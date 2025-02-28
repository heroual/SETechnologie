import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Package,
  Settings,
  Users,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  FileText,
  Calendar,
  Download,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { getDashboardStats, getAdvancedAnalytics } from '../../services/dashboardService';
import { DashboardStats, AdvancedAnalytics } from '../../types';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('sales');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [reportSchedule, setReportSchedule] = useState('');
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, name: 'Monthly Sales Report', type: 'sales', frequency: 'monthly', nextRun: '2025-04-01', format: 'pdf' },
    { id: 2, name: 'Weekly Inventory Status', type: 'inventory', frequency: 'weekly', nextRun: '2025-03-15', format: 'excel' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await getDashboardStats();
        const analyticsData = await getAdvancedAnalytics();
        
        setStats(dashboardStats);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = () => {
    toast.success(`Rapport ${reportType} généré avec succès au format ${reportFormat}`);
    setShowReportModal(false);
    
    // Simulate download after a short delay
    setTimeout(() => {
      toast.success('Téléchargement du rapport...');
    }, 1000);
  };

  const handleScheduleReport = () => {
    const newReport = {
      id: scheduledReports.length + 1,
      name: `Rapport ${reportType === 'sales' ? 'des ventes' : reportType === 'inventory' ? 'd\'inventaire' : 'des services'}`,
      type: reportType,
      frequency: reportSchedule,
      nextRun: '2025-04-01', // Example date
      format: reportFormat
    };
    
    setScheduledReports([...scheduledReports, newReport]);
    toast.success('Rapport programmé avec succès');
    setShowReportModal(false);
  };

  const handleDeleteScheduledReport = (id: number) => {
    setScheduledReports(scheduledReports.filter(report => report.id !== id));
    toast.success('Rapport programmé supprimé');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  const revenueData = analytics?.monthly_revenue.map((value, index) => ({
    name: months[index],
    value
  }));

  const topProductsData = analytics?.top_products.map(product => ({
    name: product.name,
    value: product.revenue
  }));

  return (
    <div className="space-y-6">
      {/* Header with Reports Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Tableau de bord</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center"
          >
            <FileText className="h-5 w-5 mr-2" />
            Rapports
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <Package className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <span className="text-sm text-gray-400">Produits</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">{stats?.active_products}</h3>
              <p className="text-sm text-gray-400">sur {stats?.total_products}</p>
            </div>
            <div className="text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-sm">12%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <Settings className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <span className="text-sm text-gray-400">Services</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">{stats?.available_services}</h3>
              <p className="text-sm text-gray-400">sur {stats?.total_services}</p>
            </div>
            <div className="text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-sm">8%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <span className="text-sm text-gray-400">Revenus</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">{analytics?.total_revenue.toLocaleString()} MAD</h3>
              <p className="text-sm text-gray-400">ce mois</p>
            </div>
            <div className={`${analytics?.revenue_growth && analytics.revenue_growth >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {analytics?.revenue_growth && analytics.revenue_growth >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">{analytics?.revenue_growth}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <span className="text-sm text-gray-400">Utilisateurs</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">{analytics?.active_users}</h3>
              <p className="text-sm text-gray-400">actifs</p>
            </div>
            <div className="text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-sm">{analytics?.user_growth}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scheduled Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[var(--primary)]" />
            Rapports programmés
          </h3>
        </div>
        
        {scheduledReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium">Nom</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Fréquence</th>
                  <th className="text-left py-3 px-4 font-medium">Prochaine exécution</th>
                  <th className="text-left py-3 px-4 font-medium">Format</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((report) => (
                  <tr key={report.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">{report.name}</td>
                    <td className="py-3 px-4">
                      {report.type === 'sales' ? 'Ventes' : 
                       report.type === 'inventory' ? 'Inventaire' : 'Services'}
                    </td>
                    <td className="py-3 px-4">
                      {report.frequency === 'daily' ? 'Quotidien' : 
                       report.frequency === 'weekly' ? 'Hebdomadaire' : 
                       report.frequency === 'monthly' ? 'Mensuel' : 'Personnalisé'}
                    </td>
                    <td className="py-3 px-4">{report.nextRun}</td>
                    <td className="py-3 px-4">{report.format.toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => toast.success(`Rapport ${report.name} téléchargé`)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteScheduledReport(report.id)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                        >
                          <AlertTriangle className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Aucun rapport programmé
          </div>
        )}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Revenus mensuels
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeframe === 'month' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Mois
              </button>
              <button 
                onClick={() => setTimeframe('quarter')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeframe === 'quarter' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Trimestre
              </button>
              <button 
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeframe === 'year' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                Année
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1F', 
                    borderColor: '#333',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[var(--primary)]" />
              Produits les plus vendus
            </h3>
            <button 
              onClick={() => toast.success('Rapport des produits les plus vendus généré')}
              className="px-3 py-1 rounded-lg text-sm bg-white/5 hover:bg-white/10 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </button>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topProductsData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value.toLocaleString()} MAD`}
                  contentStyle={{ 
                    backgroundColor: '#1A1A1F', 
                    borderColor: '#333',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2 text-[var(--primary)]" />
            Activités récentes
          </h3>
          <button 
            onClick={() => toast.success('Rapport d\'activités généré')}
            className="px-3 py-1 rounded-lg text-sm bg-white/5 hover:bg-white/10 flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </button>
        </div>
        
        <div className="space-y-4">
          {stats?.recent_updates.map((update, index) => (
            <div key={index} className="flex items-start p-3 rounded-lg hover:bg-white/5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                update.action === 'create' 
                  ? 'bg-green-500/20' 
                  : update.action === 'update'
                  ? 'bg-blue-500/20'
                  : 'bg-red-500/20'
              }`}>
                {update.type === 'product' ? (
                  <Package className={`h-5 w-5 ${
                    update.action === 'create' 
                      ? 'text-green-500' 
                      : update.action === 'update'
                      ? 'text-blue-500'
                      : 'text-red-500'
                  }`} />
                ) : (
                  <Settings className={`h-5 w-5 ${
                    update.action === 'create' 
                      ? 'text-green-500' 
                      : update.action === 'update'
                      ? 'text-blue-500'
                      : 'text-red-500'
                  }`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {update.action === 'create' 
                      ? 'Création' 
                      : update.action === 'update'
                      ? 'Mise à jour'
                      : 'Suppression'} d'un {update.type === 'product' ? 'produit' : 'service'}
                  </p>
                  <span className="text-sm text-gray-400">
                    {new Date(update.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {update.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Générer un rapport</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type de rapport
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="sales">Rapport des ventes</option>
                  <option value="inventory">Rapport d'inventaire</option>
                  <option value="services">Rapport des services</option>
                  <option value="users">Rapport des utilisateurs</option>
                  <option value="custom">Rapport personnalisé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={reportFormat === 'pdf'}
                      onChange={() => setReportFormat('pdf')}
                      className="mr-2"
                    />
                    PDF
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={reportFormat === 'excel'}
                      onChange={() => setReportFormat('excel')}
                      className="mr-2"
                    />
                    Excel
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={reportFormat === 'csv'}
                      onChange={() => setReportFormat('csv')}
                      className="mr-2"
                    />
                    CSV
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Programmation (optionnel)
                </label>
                <select
                  value={reportSchedule}
                  onChange={(e) => setReportSchedule(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="">Aucune (rapport unique)</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                {reportSchedule ? (
                  <button
                    onClick={handleScheduleReport}
                    className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow"
                  >
                    Programmer
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateReport}
                    className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow"
                  >
                    Générer
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;