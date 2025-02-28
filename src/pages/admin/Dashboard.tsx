import React, { useState, useEffect, useCallback } from 'react';
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
  Zap,
  Filter,
  Calendar,
  RefreshCw,
  Save,
  Sliders,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Move,
  MoreVertical,
  Download
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
  Line,
  Sector
} from 'recharts';
import type { DashboardStats, AdvancedAnalytics } from '../../types';
import { getDashboardStats, getAdvancedAnalytics } from '../../services/dashboardService';
import { getProducts } from '../../services/productService';
import { getServices } from '../../services/serviceService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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

// Widget types for dashboard customization
type WidgetType = 
  | 'stats' 
  | 'revenue' 
  | 'orders' 
  | 'users' 
  | 'performance' 
  | 'topProducts' 
  | 'activity' 
  | 'productsChart' 
  | 'categoryChart' 
  | 'statusChart';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: number;
  visible: boolean;
  expanded?: boolean;
}

// Default dashboard layout
const defaultWidgets: Widget[] = [
  { id: 'stats', type: 'stats', title: 'Statistiques', size: 'full', position: 1, visible: true },
  { id: 'revenue', type: 'revenue', title: 'Analyse des Ventes', size: 'full', position: 2, visible: true },
  { id: 'performance', type: 'performance', title: 'Indicateurs de Performance', size: 'medium', position: 3, visible: true },
  { id: 'topProducts', type: 'topProducts', title: 'Produits les plus vendus', size: 'medium', position: 4, visible: true },
  { id: 'productsChart', type: 'productsChart', title: 'Évolution des Produits et Services', size: 'large', position: 5, visible: true },
  { id: 'activity', type: 'activity', title: 'Activité Récente', size: 'small', position: 6, visible: true },
  { id: 'categoryChart', type: 'categoryChart', title: 'Distribution par Catégorie', size: 'medium', position: 7, visible: true },
  { id: 'statusChart', type: 'statusChart', title: 'Statut des Produits et Services', size: 'medium', position: 8, visible: true },
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0A0F] border border-white/10 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            {entry.name === 'revenue' ? ' MAD' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Active shape for pie chart drill-down
const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.8}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#FFF" className="text-xs">{payload.name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`${value} (${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  linkTo,
  onClick
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType; 
  trend: { value: number; isPositive: boolean };
  linkTo?: string;
  onClick?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-effect rounded-xl p-6 cursor-pointer hover:border hover:border-white/20 transition-all"
    onClick={onClick}
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
  <div className="glass-effect rounded-xl p-6 h-full">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">Activité Récente</h3>
      <Activity className="h-5 w-5 text-[var(--primary)]" />
    </div>
    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
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

const TopProductsTable = ({ 
  topProducts, 
  onProductClick 
}: { 
  topProducts: AdvancedAnalytics['top_products'],
  onProductClick?: (productId: string) => void
}) => (
  <div className="glass-effect rounded-xl p-6 h-full">
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
            <tr 
              key={product.id} 
              className="border-b border-white/10 last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => onProductClick && onProductClick(product.id)}
            >
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
  suffix,
  onClick
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  color: string;
  suffix?: string;
  onClick?: () => void;
}) => (
  <div 
    className="glass-effect rounded-xl p-6 cursor-pointer hover:border hover:border-white/20 transition-all"
    onClick={onClick}
  >
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

// Widget container component
const WidgetContainer = ({ 
  widget, 
  children, 
  onRemove, 
  onExpand, 
  onMove 
}: { 
  widget: Widget, 
  children: React.ReactNode, 
  onRemove: (id: string) => void,
  onExpand: (id: string) => void,
  onMove: (id: string, direction: 'up' | 'down') => void
}) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div 
      className={`relative ${
        widget.expanded 
          ? 'col-span-full row-span-2' 
          : widget.size === 'small' 
            ? 'col-span-1' 
            : widget.size === 'medium' 
              ? 'col-span-1 md:col-span-2' 
              : widget.size === 'large' 
                ? 'col-span-2 md:col-span-3' 
                : 'col-span-full'
      } transition-all duration-300`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {showControls && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1 bg-black/50 backdrop-blur-sm rounded-lg p-1">
          <button 
            onClick={() => onMove(widget.id, 'up')} 
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            title="Déplacer vers le haut"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onMove(widget.id, 'down')} 
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            title="Déplacer vers le bas"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onExpand(widget.id)} 
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            title={widget.expanded ? "Réduire" : "Agrandir"}
          >
            {widget.expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={() => onRemove(widget.id)} 
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            title="Supprimer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

// Date range filter component
const DateRangeFilter = ({ 
  dateRange, 
  onDateRangeChange 
}: { 
  dateRange: { start: Date, end: Date }, 
  onDateRangeChange: (range: { start: Date, end: Date }) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState(dateRange);

  const handleApply = () => {
    onDateRangeChange(tempRange);
    setIsOpen(false);
  };

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setTempRange({ start, end });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm">
          {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0A0A0F] border border-white/10 rounded-lg shadow-lg z-20 p-4">
          <div className="flex justify-between mb-4">
            <h4 className="font-medium">Période</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date de début</label>
                <input 
                  type="date" 
                  value={tempRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setTempRange({...tempRange, start: new Date(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date de fin</label>
                <input 
                  type="date" 
                  value={tempRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setTempRange({...tempRange, end: new Date(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleQuickSelect(7)} 
                className="px-3 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                7 jours
              </button>
              <button 
                onClick={() => handleQuickSelect(30)} 
                className="px-3 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                30 jours
              </button>
              <button 
                onClick={() => handleQuickSelect(90)} 
                className="px-3 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                90 jours
              </button>
              <button 
                onClick={() => handleQuickSelect(365)} 
                className="px-3 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                1 an
              </button>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-3 py-1.5 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleApply} 
                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard view selector component
const ViewSelector = ({ 
  views, 
  currentView, 
  onViewChange, 
  onSaveView, 
  onDeleteView 
}: { 
  views: { id: string, name: string }[], 
  currentView: string, 
  onViewChange: (viewId: string) => void,
  onSaveView: (name: string) => void,
  onDeleteView: (viewId: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const handleSave = () => {
    if (newViewName.trim()) {
      onSaveView(newViewName.trim());
      setNewViewName('');
      setShowSaveDialog(false);
    }
  };

  const currentViewName = views.find(v => v.id === currentView)?.name || 'Vue personnalisée';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm">{currentViewName}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#0A0A0F] border border-white/10 rounded-lg shadow-lg z-20">
          <div className="p-2">
            {views.map(view => (
              <div 
                key={view.id} 
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                  currentView === view.id ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-white/5'
                }`}
                onClick={() => {
                  onViewChange(view.id);
                  setIsOpen(false);
                }}
              >
                <span>{view.name}</span>
                {view.id !== 'default' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteView(view.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-2">
            <button 
              onClick={() => {
                setShowSaveDialog(true);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 w-full px-3 py-2 text-left rounded-lg hover:bg-white/5 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer la vue actuelle</span>
            </button>
          </div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Enregistrer la vue</h3>
            <input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="Nom de la vue"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowSaveDialog(false)} 
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave} 
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
                disabled={!newViewName.trim()}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add widget dialog component
const AddWidgetDialog = ({ 
  onClose, 
  onAddWidget, 
  availableWidgets 
}: { 
  onClose: () => void, 
  onAddWidget: (widgetType: WidgetType) => void,
  availableWidgets: WidgetType[]
}) => {
  const widgetOptions = [
    { type: 'stats', title: 'Statistiques', icon: <BarChart2 className="h-5 w-5" /> },
    { type: 'revenue', title: 'Analyse des Ventes', icon: <DollarSign className="h-5 w-5" /> },
    { type: 'performance', title: 'Indicateurs de Performance', icon: <Activity className="h-5 w-5" /> },
    { type: 'topProducts', title: 'Produits les plus vendus', icon: <Award className="h-5 w-5" /> },
    { type: 'productsChart', title: 'Évolution des Produits et Services', icon: <TrendingUp className="h-5 w-5" /> },
    { type: 'activity', title: 'Activité Récente', icon: <Activity className="h-5 w-5" /> },
    { type: 'categoryChart', title: 'Distribution par Catégorie', icon: <PieChart className="h-5 w-5" /> },
    { type: 'statusChart', title: 'Statut des Produits et Services', icon: <BarChart2 className="h-5 w-5" /> },
  ].filter(widget => availableWidgets.includes(widget.type as WidgetType));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Ajouter un widget</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {widgetOptions.map(widget => (
            <div 
              key={widget.type}
              className="glass-effect rounded-lg p-4 cursor-pointer hover:border hover:border-[var(--primary)]/50 transition-all"
              onClick={() => {
                onAddWidget(widget.type as WidgetType);
                onClose();
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-[var(--primary)]/20">
                  {widget.icon}
                </div>
                <h4 className="font-medium">{widget.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Product detail dialog component
const ProductDetailDialog = ({ 
  productId, 
  onClose 
}: { 
  productId: string, 
  onClose: () => void 
}) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the product details from your API
        // For demo purposes, we'll simulate a product fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock product data
        setProduct({
          id: productId,
          name: productId === 'router-pro-x1' ? 'Router Pro X1' : 
                productId === 'camera-360-pro' ? 'Caméra 360° Pro' : 
                'Produit ' + productId,
          category: 'Réseau',
          price: 1299,
          stock: 25,
          sales: {
            monthly: [12, 15, 18, 22, 19, 24, 28, 30, 25, 32, 35, 48],
            total: 308,
            growth: 15
          },
          revenue: {
            monthly: [15588, 19485, 23382, 28578, 24681, 31176, 36372, 38970, 32475, 41568, 45465, 62352],
            total: 399992,
            growth: 18
          },
          customers: [
            { id: 1, name: 'Entreprise A', purchases: 12, value: 15588 },
            { id: 2, name: 'Entreprise B', purchases: 8, value: 10392 },
            { id: 3, name: 'Particulier C', purchases: 5, value: 6495 },
          ]
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Erreur lors du chargement des détails du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-4xl p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Détails du produit</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center py-12 text-gray-400">
            Produit non trouvé
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0F] border border-white/10 rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                // In a real app, you would download a report
                toast.success('Rapport téléchargé');
              }} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Télécharger le rapport"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-effect rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-1">Ventes totales</h4>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{product.sales.total}</span>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUp className="h-3 w-3 mr-1" />
                {product.sales.growth}%
              </div>
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-1">Revenu total</h4>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{product.revenue.total.toLocaleString()} MAD</span>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUp className="h-3 w-3 mr-1" />
                {product.revenue.growth}%
              </div>
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-4">
            <h4 className="text-sm text-gray-400 mb-1">Stock actuel</h4>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{product.stock}</span>
              <span className="text-sm text-gray-400">unités</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-effect rounded-xl p-4">
            <h4 className="font-medium mb-4">Évolution des ventes</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.sales.monthly.map((value: number, index: number) => ({ month: MONTHS[index], sales: value }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-4">
            <h4 className="font-medium mb-4">Évolution du revenu</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={product.revenue.monthly.map((value: number, index: number) => ({ month: MONTHS[index], revenue: value }))}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-xl p-4">
          <h4 className="font-medium mb-4">Principaux clients</h4>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 font-medium text-gray-400">Client</th>
                <th className="text-right py-2 font-medium text-gray-400">Achats</th>
                <th className="text-right py-2 font-medium text-gray-400">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {product.customers.map((customer: any) => (
                <tr key={customer.id} className="border-b border-white/10 last:border-0">
                  <td className="py-3">{customer.name}</td>
                  <td className="py-3 text-right">{customer.purchases}</td>
                  <td className="py-3 text-right">{customer.value.toLocaleString()} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
  
  // State for interactive features
  const [activeIndex, setActiveIndex] = useState(0);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // State for dashboard customization
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false);
  const [savedViews, setSavedViews] = useState([
    { id: 'default', name: 'Vue par défaut' }
  ]);
  const [currentView, setCurrentView] = useState('default');
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  useEffect(() => {
    // Set up auto-refresh if enabled
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        fetchData();
        toast.success('Données actualisées', { 
          icon: <RefreshCw className="h-4 w-4 text-[var(--primary)]" />,
          duration: 2000
        });
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAutoRefresh]);

  const fetchData = useCallback(async () => {
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
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Prepare revenue data for chart
  const revenueData = analytics ? 
    analytics.monthly_revenue.map((value, index) => ({
      name: MONTHS[index],
      revenue: value
    })) : [];

  // Handle pie chart interaction
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Handle widget management
  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, visible: false } : w
    ));
  };

  const handleExpandWidget = (widgetId: string) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, expanded: !w.expanded } : w
    ));
  };

  const handleMoveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const widgetIndex = widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex === -1) return;
    
    const newWidgets = [...widgets];
    
    if (direction === 'up' && widgetIndex > 0) {
      // Swap with the previous widget
      const temp = newWidgets[widgetIndex].position;
      newWidgets[widgetIndex].position = newWidgets[widgetIndex - 1].position;
      newWidgets[widgetIndex - 1].position = temp;
    } else if (direction === 'down' && widgetIndex < widgets.length - 1) {
      // Swap with the next widget
      const temp = newWidgets[widgetIndex].position;
      newWidgets[widgetIndex].position = newWidgets[widgetIndex + 1].position;
      newWidgets[widgetIndex + 1].position = temp;
    }
    
    // Sort widgets by position
    newWidgets.sort((a, b) => a.position - b.position);
    setWidgets(newWidgets);
  };

  const handleAddWidget = (widgetType: WidgetType) => {
    const existingWidget = widgets.find(w => w.type === widgetType && !w.visible);
    
    if (existingWidget) {
      // Re-enable existing widget
      setWidgets(widgets.map(w => 
        w.id === existingWidget.id ? { ...w, visible: true } : w
      ));
    } else {
      // Create new widget
      const newWidget: Widget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
        title: getWidgetTitle(widgetType),
        size: getWidgetSize(widgetType),
        position: widgets.length + 1,
        visible: true
      };
      
      setWidgets([...widgets, newWidget]);
    }
  };

  const getWidgetTitle = (type: WidgetType): string => {
    switch (type) {
      case 'stats': return 'Statistiques';
      case 'revenue': return 'Analyse des Ventes';
      case 'orders': return 'Commandes';
      case 'users': return 'Utilisateurs';
      case 'performance': return 'Indicateurs de Performance';
      case 'topProducts': return 'Produits les plus vendus';
      case 'activity': return 'Activité Récente';
      case 'productsChart': return 'Évolution des Produits et Services';
      case 'categoryChart': return 'Distribution par Catégorie';
      case 'statusChart': return 'Statut des Produits et Services';
      default: return 'Widget';
    }
  };

  const getWidgetSize = (type: WidgetType): Widget['size'] => {
    switch (type) {
      case 'stats': return 'full';
      case 'revenue': return 'full';
      case 'performance': return 'medium';
      case 'topProducts': return 'medium';
      case 'activity': return 'small';
      case 'productsChart': return 'large';
      case 'categoryChart': return 'medium';
      case 'statusChart': return 'medium';
      default: return 'medium';
    }
  };

  // Handle saved views
  const handleSaveView = (name: string) => {
    const newViewId = `view-${Date.now()}`;
    const newView = { id: newViewId, name };
    
    // Save current widget configuration
    localStorage.setItem(`dashboard-view-${newViewId}`, JSON.stringify(widgets));
    
    setSavedViews([...savedViews, newView]);
    setCurrentView(newViewId);
    toast.success(`Vue "${name}" enregistrée`);
  };

  const handleViewChange = (viewId: string) => {
    if (viewId === 'default') {
      setWidgets(defaultWidgets);
    } else {
      // Load saved widget configuration
      const savedWidgets = localStorage.getItem(`dashboard-view-${viewId}`);
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      }
    }
    setCurrentView(viewId);
  };

  const handleDeleteView = (viewId: string) => {
    if (viewId === 'default') return;
    
    // Remove from saved views
    setSavedViews(savedViews.filter(v => v.id !== viewId));
    
    // Remove from localStorage
    localStorage.removeItem(`dashboard-view-${viewId}`);
    
    // If current view is deleted, switch to default
    if (currentView === viewId) {
      handleViewChange('default');
    }
    
    toast.success('Vue supprimée');
  };

  // Get available widgets (not currently visible)
  const getAvailableWidgetTypes = (): WidgetType[] => {
    const allTypes: WidgetType[] = [
      'stats', 'revenue', 'performance', 'topProducts', 
      'activity', 'productsChart', 'categoryChart', 'statusChart'
    ];
    
    const visibleTypes = widgets.filter(w => w.visible).map(w => w.type);
    
    return allTypes.filter(type => !visibleTypes.includes(type));
  };

  // Handle product detail view
  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  // Render widget content based on type
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Produits"
              value={stats.total_products}
              icon={Package}
              trend={{ value: 12, isPositive: true }}
              linkTo="/admin/products"
              onClick={() => setCategoryFilter('')}
            />
            <StatCard
              title="Produits Actifs"
              value={stats.active_products}
              icon={TrendingUp}
              trend={{ value: 8, isPositive: true }}
              linkTo="/admin/products"
              onClick={() => setStatusFilter('active')}
            />
            <StatCard
              title="Total Services"
              value={stats.total_services}
              icon={Settings}
              trend={{ value: 5, isPositive: true }}
              linkTo="/admin/services"
              onClick={() => setCategoryFilter('')}
            />
            <StatCard
              title="Services Disponibles"
              value={stats.available_services}
              icon={Users}
              trend={{ value: 3, isPositive: false }}
              linkTo="/admin/services"
              onClick={() => setStatusFilter('available')}
            />
          </div>
        );
      
      case 'revenue':
        return analytics ? (
          <div className="space-y-6">
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
            
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Évolution du Revenu Mensuel</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      // In a real app, you would download the data
                      toast.success('Données exportées en CSV');
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Exporter les données"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
                    <Tooltip content={<CustomTooltip />} />
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
        ) : null;
      
      case 'performance':
        return analytics ? (
          <div className="grid grid-cols-2 gap-6">
            <PerformanceIndicator
              title="Santé Inventaire"
              value={analytics.inventory_health}
              icon={Package}
              color="blue"
              suffix="%"
              onClick={() => toast.info('Détails de la santé de l\'inventaire')}
            />
            <PerformanceIndicator
              title="Utilisation Services"
              value={analytics.service_utilization}
              icon={Settings}
              color="green"
              suffix="%"
              onClick={() => toast.info('Détails de l\'utilisation des services')}
            />
          </div>
        ) : null;
      
      case 'topProducts':
        return analytics ? (
          <TopProductsTable 
            topProducts={analytics.top_products} 
            onProductClick={handleProductClick}
          />
        ) : null;
      
      case 'activity':
        return <RecentActivity recentUpdates={stats.recent_updates} />;
      
      case 'productsChart':
        return (
          <div className="glass-effect rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Évolution des Produits et Services</h3>
              <div className="flex items-center space-x-2">
                <select 
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm"
                  onChange={(e) => {
                    // In a real app, you would filter the data
                    toast.info(`Filtré par ${e.target.value}`);
                  }}
                >
                  <option value="all">Tous</option>
                  <option value="products">Produits</option>
                  <option value="services">Services</option>
                </select>
              </div>
            </div>
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
                  <Tooltip content={<CustomTooltip />} />
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
        );
      
      case 'categoryChart':
        return (
          <div className="glass-effect rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Distribution par Catégorie</h3>
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-[300px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
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
        );
      
      case 'statusChart':
        return (
          <div className="glass-effect rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Statut des Produits et Services</h3>
              <div className="flex items-center space-x-2">
                <select 
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-sm"
                  onChange={(e) => {
                    // In a real app, you would filter the data
                    toast.info(`Vue: ${e.target.value}`);
                  }}
                >
                  <option value="count">Nombre</option>
                  <option value="percentage">Pourcentage</option>
                </select>
              </div>
            </div>
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
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="var(--primary)">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Tableau de bord</h2>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
          
          <ViewSelector 
            views={savedViews}
            currentView={currentView}
            onViewChange={handleViewChange}
            onSaveView={handleSaveView}
            onDeleteView={handleDeleteView}
          />
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsAutoRefresh(!isAutoRefresh)} 
              className={`p-2 rounded-lg ${
                isAutoRefresh ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white/5 hover:bg-white/10'
              } transition-colors`}
              title={isAutoRefresh ? "Désactiver l'actualisation automatique" : "Activer l'actualisation automatique"}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => setIsEditMode(!isEditMode)} 
              className={`p-2 rounded-lg ${
                isEditMode ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white/5 hover:bg-white/10'
              } transition-colors`}
              title={isEditMode ? "Quitter le mode édition" : "Personnaliser le tableau de bord"}
            >
              <Sliders className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => fetchData()} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Actualiser les données"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="glass-effect rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sliders className="h-5 w-5 text-[var(--primary)]" />
            <span>Mode personnalisation: Réorganisez, ajoutez ou supprimez des widgets</span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAddWidgetDialog(true)}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un widget</span>
            </button>
            <button 
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
            >
              Terminer
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {widgets
          .filter(widget => widget.visible)
          .sort((a, b) => a.position - b.position)
          .map(widget => (
            <WidgetContainer 
              key={widget.id} 
              widget={widget}
              onRemove={handleRemoveWidget}
              onExpand={handleExpandWidget}
              onMove={handleMoveWidget}
            >
              {renderWidgetContent(widget)}
            </WidgetContainer>
          ))}
      </div>

      {/* Add Widget Dialog */}
      {showAddWidgetDialog && (
        <AddWidgetDialog 
          onClose={() => setShowAddWidgetDialog(false)}
          onAddWidget={handleAddWidget}
          availableWidgets={getAvailableWidgetTypes()}
        />
      )}

      {/* Product Detail Dialog */}
      {selectedProductId && (
        <ProductDetailDialog 
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;