import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Star
} from 'lucide-react';
import type { Service } from '../../types';

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Installation Wi-Fi Pro',
    category: 'Réseau',
    description: 'Installation et configuration de réseaux Wi-Fi professionnels',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
    pricing_type: 'quote',
    status: 'available',
    featured: true,
    created_at: '2024-02-24T10:00:00Z',
    updated_at: '2024-02-24T10:00:00Z'
  },
  {
    id: '2',
    name: 'Maintenance IT',
    category: 'Support',
    description: 'Service de maintenance informatique complet',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780',
    pricing_type: 'fixed',
    price: 499,
    status: 'available',
    featured: false,
    created_at: '2024-02-24T11:00:00Z',
    updated_at: '2024-02-24T11:00:00Z'
  }
];

const ServiceCard = ({ service }: { service: Service }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={service.image}
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
                <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  {service.featured ? 'Retirer' : 'Mettre en avant'}
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center text-red-500">
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Gestion des Services</h2>
        <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center">
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
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;