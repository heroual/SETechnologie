import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Router, 
  Shield, 
  Camera, 
  Wifi, 
  Lock, 
  Star,
  ChevronRight, 
  ChevronLeft,
  ShoppingCart,
  Filter,
  Search
} from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  promo?: {
    percentage: number;
    endDate: string;
  };
  description: string;
  images: string[];
  specs: {
    dimensions: string;
    weight: string;
    compatibility: string[];
    specifications: string[];
    certifications: string[];
    warranty: string;
  };
  stock: 'En stock' | 'Rupture de stock' | 'Sur commande';
  rating: number;
  reviews: number;
  features: string[];
}

const products: Product[] = [
  {
    id: 'router-pro-x1',
    name: 'Router Pro X1',
    category: 'Réseau',
    price: 1299,
    promo: {
      percentage: 10,
      endDate: '2024-03-31'
    },
    description: 'Routeur professionnel haute performance avec technologie Wi-Fi 6E pour une couverture optimale et des vitesses ultra-rapides.',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'
    ],
    specs: {
      dimensions: '22 x 16 x 4 cm',
      weight: '680g',
      compatibility: ['Wi-Fi 6E', '2.4GHz', '5GHz', '6GHz'],
      specifications: [
        'Vitesse jusqu\'à 11 Gbps',
        'Couverture jusqu\'à 300m²',
        '12 antennes MIMO',
        'Processeur quad-core 2.2GHz'
      ],
      certifications: ['CE', 'RoHS', 'FCC'],
      warranty: '3 ans garantie constructeur'
    },
    stock: 'En stock',
    rating: 4.8,
    reviews: 156,
    features: [
      'Triple bande simultanée',
      'Technologie MU-MIMO',
      'Sécurité WPA3',
      'QoS avancé'
    ]
  },
  {
    id: 'camera-360-pro',
    name: 'Caméra 360° Pro',
    category: 'Sécurité',
    price: 899,
    description: 'Caméra de surveillance 360° avec vision nocturne et détection de mouvement IA.',
    images: [
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb',
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb'
    ],
    specs: {
      dimensions: '12 x 12 x 15 cm',
      weight: '450g',
      compatibility: ['Wi-Fi', 'Ethernet', 'PoE'],
      specifications: [
        'Résolution 4K',
        'Vision nocturne 30m',
        'Audio bidirectionnel',
        'Stockage cloud'
      ],
      certifications: ['CE', 'IP67'],
      warranty: '2 ans garantie constructeur'
    },
    stock: 'En stock',
    rating: 4.6,
    reviews: 89,
    features: [
      'Détection IA',
      'Vision nocturne IR',
      'Audio HD',
      'Étanche IP67'
    ]
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl overflow-hidden"
    >
      <div className="relative">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-64 object-cover"
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
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">{product.description}</p>

        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-2xl font-bold hero-gradient">
              {product.promo ? (
                <>
                  {(product.price * (1 - product.promo.percentage / 100)).toFixed(2)} MAD
                  <span className="text-sm line-through ml-2 text-gray-400">
                    {product.price} MAD
                  </span>
                </>
              ) : (
                `${product.price} MAD`
              )}
            </span>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${
            product.stock === 'En stock' 
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {product.stock}
          </span>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 px-4 py-2 rounded-full bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
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
          <h1 className="text-4xl font-bold mb-4 hero-gradient">
            Nos Produits
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Découvrez notre gamme complète de solutions technologiques innovantes pour votre maison et votre entreprise.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-effect p-6 rounded-xl">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-[var(--primary)]" />
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
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
            <div className="relative">
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;