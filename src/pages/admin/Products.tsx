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
  Upload,
  X,
  Loader
} from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '../../services/productService';
import type { Product, ProductFormData } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import toast from 'react-hot-toast';
import ProductForm from '../../components/admin/ProductForm';
import DeleteConfirmation from '../../components/admin/DeleteConfirmation';

const ProductRow = ({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product; 
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) => {
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
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
              onClick={() => {
                setShowActions(false);
                window.open(`/products/${product.id}`, '_blank');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </button>
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center"
              onClick={() => {
                setShowActions(false);
                onEdit(product);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button 
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center text-red-500"
              onClick={() => {
                setShowActions(false);
                onDelete(product);
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

const Products = () => {
  const { currentUser } = useAuth();
  const { products, loading, error, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async (formData: ProductFormData, files: File[]) => {
    try {
      setIsSubmitting(true);
      
      if (editingProduct) {
        // Update existing product
        await updateProduct(
          editingProduct.id, 
          formData, 
          files,
          currentUser?.uid || 'unknown'
        );
        toast.success('Produit mis à jour avec succès');
      } else {
        // Create new product
        await createProduct(
          formData, 
          files,
          currentUser?.uid || 'unknown'
        );
        toast.success('Produit ajouté avec succès');
      }
      
      // No need to refresh products as we're using real-time listeners
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erreur lors de l\'enregistrement du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteProduct(
        productToDelete.id,
        currentUser?.uid || 'unknown'
      );
      
      toast.success('Produit supprimé avec succès');
      // No need to refresh products as we're using real-time listeners
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get unique categories for filter
  const categories = ['', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesStatus = statusFilter ? product.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
          <button 
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center"
            onClick={handleAddProduct}
          >
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
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
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

      {/* Products Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-12 w-12 text-[var(--primary)] animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => refreshProducts()}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white"
            >
              Réessayer
            </button>
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
                    <ProductRow 
                      key={product.id} 
                      product={product} 
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
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

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          initialData={editingProduct ? {
            id: editingProduct.id,
            name: editingProduct.name,
            category: editingProduct.category,
            description: editingProduct.description,
            price: editingProduct.price,
            stock: editingProduct.stock,
            status: editingProduct.status,
            seo_keywords: editingProduct.seo_keywords
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && productToDelete && (
        <DeleteConfirmation
          title="Supprimer le produit"
          message={`Êtes-vous sûr de vouloir supprimer le produit "${productToDelete.name}" ? Cette action est irréversible.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setProductToDelete(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Products;