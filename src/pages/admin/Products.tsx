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
  Upload
} from 'lucide-react';
import type { Product } from '../../types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Router Pro X1',
    category: 'Réseau',
    description: 'Routeur professionnel haute performance',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'],
    price: 1299,
    stock: 45,
    status: 'active',
    seo_keywords: ['router', 'wifi', 'réseau'],
    created_at: '2024-02-24T10:00:00Z',
    updated_at: '2024-02-24T10:00:00Z'
  },
  {
    id: '2',
    name: 'Caméra 360° Pro',
    category: 'Sécurité',
    description: 'Caméra de surveillance 360°',
    images: ['https://images.unsplash.com/photo-1557324232-b8917d3c3dcb'],
    price: 899,
    stock: 30,
    status: 'active',
    seo_keywords: ['caméra', 'surveillance', 'sécurité'],
    created_at: '2024-02-24T11:00:00Z',
    updated_at: '2024-02-24T11:00:00Z'
  }
];

const ProductRow = ({ product }: { product: Product }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/10 hover:bg-white/5"
    >
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-400">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">{product.price} MAD</td>
      <td className="py-4 px-6">{product.stock}</td>
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            product.status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {product.status}
        </span>
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
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center text-red-500">
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          </div>
        )}
      </td>
    </motion.tr>
  );
};

const Products = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Gestion des Produits</h2>
        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Importer
          </button>
          <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Produit
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
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

      {/* Products Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-4 px-6 font-medium">Produit</th>
                <th className="text-left py-4 px-6 font-medium">Prix</th>
                <th className="text-left py-4 px-6 font-medium">Stock</th>
                <th className="text-left py-4 px-6 font-medium">Statut</th>
                <th className="text-left py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;