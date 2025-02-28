import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail,
  Trash,
  Download,
  X,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TruckIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  updatedAt: string;
}

const OrderRow = ({ order }: { order: Order }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">En attente</span>;
      case 'processing':
        return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">En traitement</span>;
      case 'shipped':
        return <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">Expédiée</span>;
      case 'delivered':
        return <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Livrée</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">Annulée</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">En attente</span>;
      case 'paid':
        return <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Payée</span>;
      case 'failed':
        return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">Échouée</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/10 hover:bg-white/5"
    >
      <td className="py-4 px-6">
        <div className="font-medium">{order.orderNumber}</div>
        <div className="text-sm text-gray-400">{formatDate(order.createdAt)}</div>
      </td>
      <td className="py-4 px-6">
        <div className="font-medium">{order.customer.name}</div>
        <div className="text-sm text-gray-400">{order.customer.email}</div>
      </td>
      <td className="py-4 px-6">
        {getStatusBadge(order.status)}
      </td>
      <td className="py-4 px-6">
        {getPaymentStatusBadge(order.paymentStatus)}
      </td>
      <td className="py-4 px-6 text-right">
        <div className="font-medium">{order.total.toFixed(2)} MAD</div>
        <div className="text-sm text-gray-400">{order.items.length} articles</div>
      </td>
      <td className="py-4 px-6 relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {showActions && (
          <div className="absolute right-6 mt-2 w-48 rounded-lg bg-[#1A1A1F] border border-white/10 shadow-lg py-1 z-10">
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
              onClick={() => {
                setShowActions(false);
                toast.success('Détails de la commande');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir les détails
            </button>
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
              onClick={() => {
                setShowActions(false);
                toast.success('Email envoyé au client');
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contacter le client
            </button>
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
              onClick={() => {
                setShowActions(false);
                toast.success('Facture téléchargée');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger la facture
            </button>
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center text-red-500"
              onClick={() => {
                setShowActions(false);
                toast.error('Cette action n\'est pas disponible en mode démo');
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          </div>
        )}
      </td>
    </motion.tr>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Mock orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-123456',
            customer: {
              name: 'Ahmed Benali',
              email: 'ahmed.benali@example.com',
              phone: '0612345678'
            },
            items: [
              {
                id: 'router-pro-x1',
                name: 'Router Pro X1',
                price: 1299,
                quantity: 1
              },
              {
                id: 'camera-360-pro',
                name: 'Caméra 360° Pro',
                price: 899,
                quantity: 2
              }
            ],
            total: 3097,
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            shippingMethod: 'standard',
            createdAt: '2025-03-10T14:30:00Z',
            updatedAt: '2025-03-10T15:45:00Z'
          },
          {
            id: '2',
            orderNumber: 'ORD-123457',
            customer: {
              name: 'Fatima Zahra',
              email: 'fatima.zahra@example.com',
              phone: '0623456789'
            },
            items: [
              {
                id: 'smart-lock-pro',
                name: 'Smart Lock Pro',
                price: 799,
                quantity: 1
              }
            ],
            total: 799,
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'transfer',
            shippingMethod: 'express',
            createdAt: '2025-03-09T10:15:00Z',
            updatedAt: '2025-03-11T09:30:00Z'
          },
          {
            id: '3',
            orderNumber: 'ORD-123458',
            customer: {
              name: 'Karim Alaoui',
              email: 'karim.alaoui@example.com',
              phone: '0634567890'
            },
            items: [
              {
                id: 'mesh-wifi-system',
                name: 'Système Mesh Wi-Fi',
                price: 1499,
                quantity: 1
              }
            ],
            total: 1499,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'cash',
            shippingMethod: 'standard',
            createdAt: '2025-03-12T08:45:00Z',
            updatedAt: '2025-03-12T08:45:00Z'
          },
          {
            id: '4',
            orderNumber: 'ORD-123459',
            customer: {
              name: 'Nadia Mansouri',
              email: 'nadia.mansouri@example.com',
              phone: '0645678901'
            },
            items: [
              {
                id: 'router-pro-x1',
                name: 'Router Pro X1',
                price: 1299,
                quantity: 1
              }
            ],
            total: 1299,
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            shippingMethod: 'express',
            createdAt: '2025-03-08T11:20:00Z',
            updatedAt: '2025-03-11T16:30:00Z'
          },
          {
            id: '5',
            orderNumber: 'ORD-123460',
            customer: {
              name: 'Youssef El Amrani',
              email: 'youssef.elamrani@example.com',
              phone: '0656789012'
            },
            items: [
              {
                id: 'camera-360-pro',
                name: 'Caméra 360° Pro',
                price: 899,
                quantity: 1
              }
            ],
            total: 899,
            status: 'cancelled',
            paymentStatus: 'failed',
            paymentMethod: 'card',
            shippingMethod: 'standard',
            createdAt: '2025-03-07T09:10:00Z',
            updatedAt: '2025-03-07T14:25:00Z'
          }
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesPaymentStatus = paymentStatusFilter ? order.paymentStatus === paymentStatusFilter : true;
    
    // Date filter logic
    let matchesDate = true;
    if (dateFilter) {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      matchesDate = orderDate === dateFilter;
    }
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDate;
  });

  // Order statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Gestion des Commandes</h2>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold">{totalOrders}</div>
          <div className="text-sm text-gray-400">Total</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-yellow-400">{pendingOrders}</div>
          <div className="text-sm text-gray-400">En attente</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-blue-400">{processingOrders}</div>
          <div className="text-sm text-gray-400">En traitement</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-purple-400">{shippedOrders}</div>
          <div className="text-sm text-gray-400">Expédiées</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-green-400">{deliveredOrders}</div>
          <div className="text-sm text-gray-400">Livrées</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-red-400">{cancelledOrders}</div>
          <div className="text-sm text-gray-400">Annulées</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
            
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">Tous les paiements</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="failed">Échouée</option>
            </select>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            />
            
            {(searchTerm || statusFilter || paymentStatusFilter || dateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPaymentStatusFilter('');
                  setDateFilter('');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredOrders.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 font-medium">Commande</th>
                    <th className="text-left py-4 px-6 font-medium">Client</th>
                    <th className="text-left py-4 px-6 font-medium">Statut</th>
                    <th className="text-left py-4 px-6 font-medium">Paiement</th>
                    <th className="text-right py-4 px-6 font-medium">Total</th>
                    <th className="text-left py-4 px-6 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Aucune commande trouvée
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Processing Tips */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-[var(--primary)]" />
          Conseils pour le traitement des commandes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mr-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="font-medium">Commandes en attente</h4>
              <p className="text-sm text-gray-400 mt-1">
                Traitez les commandes en attente dans les 24 heures pour maintenir un bon niveau de satisfaction client.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mr-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-medium">Confirmation d'expédition</h4>
              <p className="text-sm text-gray-400 mt-1">
                Envoyez toujours un email de confirmation d'expédition avec le numéro de suivi pour rassurer le client.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mr-3">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h4 className="font-medium">Commandes annulées</h4>
              <p className="text-sm text-gray-400 mt-1">
                Contactez le client pour comprendre la raison de l'annulation et proposez une solution alternative si possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;