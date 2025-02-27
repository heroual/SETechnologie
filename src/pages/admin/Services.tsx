import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Star,
  X
} from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../../services/serviceService';
import type { Service, ServiceFormData } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import ServiceForm from '../../components/admin/ServiceForm';
import DeleteConfirmation from '../../components/admin/DeleteConfirmation';

const ServiceCard = ({ 
  service,
  onEdit,
  onDelete,
  onToggleFeatured
}: { 
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleFeatured: (service: Service) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={service.image || 'https://via.placeholder.com/300x200'}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {service.featured && (
          <div className="absolute top-4 right-4 bg-yellow-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="h-4 w-4 mr-1 fill-current" />
            Mis en avant
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.category}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1A1A1F] border border-white/10 shadow-lg py-1 z-10">
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
                  onClick={() => {
                    setShowActions(false);
                    window.open(`/services/${service.id}`, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </button>
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
                  onClick={() => {
                    setShowActions(false);
                    onEdit(service);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </button>
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
                  onClick={() => {
                    setShowActions(false);
                    onToggleFeatured(service);
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {service.featured ? 'Retirer' : 'Mettre en avant'}
                </button>
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center text-red-500"
                  onClick={() => {
                    setShowActions(false);
                    onDelete(service);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              service.status === 'available'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {service.status}
          </span>
          <span className="text-sm text-gray-400">
            {service.pricing_type === 'fixed'
              ? `${service.price} MAD`
              : 'Sur devis'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const handleToggleFeatured = async (service: Service) => {
    try {
      await updateService(
        service.id,
        {
          ...service,
          featured: !service.featured
        },
        undefined,
        currentUser?.uid
      );
      
      toast.success(`Service ${!service.featured ? 'mis en avant' : 'retiré de la mise en avant'}`);
      fetchServices();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Erreur lors de la mise à jour du service');
    }
  };

  const handleFormSubmit = async (formData: ServiceFormData, file?: File) => {
    try {
      setIsSubmitting(true);
      
      if (editingService) {
        // Update existing service
        await updateService(
          editingService.id, 
          formData, 
          file,
          currentUser?.uid
        );
        toast.success('Service mis à jour avec succès');
      } else {
        // Create new service
        await createService(
          formData, 
          file,
          currentUser?.uid
        );
        toast.success('Service ajouté avec succès');
      }
      
      // Refresh services list
      fetchServices();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Erreur lors de l\'enregistrement du service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteService(
        serviceToDelete.id,
        currentUser?.uid
      );
      
      toast.success('Service supprimé avec succès');
      fetchServices();
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erreur lors de la suppression du service');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get unique categories for filter
  const categories = ['', ...new Set(services.map(service => service.category))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
    const matchesStatus = statusFilter ? service.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Gestion des Services</h2>
        <button 
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center"
          onClick={handleAddService}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau Service
        </button>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">Toutes les catégories</option>
              {categories.filter(c => c).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="unavailable">Indisponible</option>
            </select>
            
            {(searchTerm || categoryFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setStatusFilter('');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onToggleFeatured={handleToggleFeatured}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-400">
              Aucun service trouvé
            </div>
          )}
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          initialData={editingService ? {
            id: editingService.id,
            name: editingService.name,
            category: editingService.category,
            description: editingService.description,
            pricing_type: editingService.pricing_type,
            price: editingService.price,
            status: editingService.status,
            featured: editingService.featured
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && serviceToDelete && (
        <DeleteConfirmation
          title="Supprimer le service"
          message={`Êtes-vous sûr de vouloir supprimer le service "${serviceToDelete.name}" ? Cette action est irréversible.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setServiceToDelete(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Services;