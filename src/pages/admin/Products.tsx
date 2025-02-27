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
  Upload
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

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
            src={product.images[0] || 'https://via.placeholder.com/40'}
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredProducts.length > 0 ? (
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
                  {filteredProducts.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Aucun produit trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;