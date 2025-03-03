import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Shield, 
  HomeIcon, 
  ChevronRight, 
  Star,
  ShoppingCart,
  Filter,
  Search,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl overflow-hidden h-full flex flex-col"
    >
      <div className="relative">
        <img
          src={product.images[currentImageIndex] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        {product.promo && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{product.promo.percentage}%
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {product.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                currentImageIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">4.5</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-2xl font-bold hero-gradient">
              {product.price.toFixed(2)} MAD
            </span>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${
            product.stock > 0 
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
          </span>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 px-4 py-2 rounded-full bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ajouter au panier
          </motion.button>
          <Link to={`/products/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full border border-[var(--primary)] text-white"
            >
              Détails
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const categories = ['Tous', 'Réseau', 'Sécurité', 'Smart Home'];
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { products, loading, error } = useProducts();

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'Tous' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 hero-gradient">
            Nos Produits
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Découvrez notre gamme complète de solutions technologiques innovantes pour votre maison et votre entreprise.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-effect p-4 md:p-6 rounded-xl">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="w-5 h-5 text-[var(--primary)]" />
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm transition-all ${
                      selectedCategory === category
                        ? 'bg-[var(--primary)] text-white neon-glow'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full bg-white/5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 text-[var(--primary)] animate-spin" />
            <span className="ml-4 text-lg">Chargement des produits...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 glass-effect rounded-xl p-8">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun produit ne correspond à votre recherche.</p>
            <button 
              onClick={() => {
                setSelectedCategory('Tous');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;