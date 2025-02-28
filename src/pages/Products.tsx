import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

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
  },
  {
    id: 'smart-lock-pro',
    name: 'Smart Lock Pro',
    category: 'Smart Home',
    price: 799,
    description: 'Serrure connectée avec reconnaissance faciale, empreinte digitale et code PIN pour une sécurité maximale.',
    images: [
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05',
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05'
    ],
    specs: {
      dimensions: '15 x 7 x 3 cm',
      weight: '350g',
      compatibility: ['Wi-Fi', 'Bluetooth', 'Zigbee'],
      specifications: [
        'Reconnaissance faciale',
        'Lecteur d\'empreintes',
        'Clavier tactile',
        'Batterie longue durée'
      ],
      certifications: ['CE', 'FCC'],
      warranty: '2 ans garantie constructeur'
    },
    stock: 'En stock',
    rating: 4.7,
    reviews: 112,
    features: [
      'Accès à distance',
      'Historique d\'accès',
      'Alertes en temps réel',
      'Installation facile'
    ]
  },
  {
    id: 'mesh-wifi-system',
    name: 'Système Mesh Wi-Fi',
    category: 'Réseau',
    price: 1499,
    description: 'Système Wi-Fi maillé pour une couverture complète de votre maison ou bureau sans zones mortes.',
    images: [
      'https://images.unsplash.com/photo-1573164713988-8665fc963095',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095'
    ],
    specs: {
      dimensions: '12 x 12 x 5 cm (par unité)',
      weight: '400g (par unité)',
      compatibility: ['Wi-Fi 6', '2.4GHz', '5GHz'],
      specifications: [
        'Pack de 3 unités',
        'Couverture jusqu\'à 500m²',
        'Vitesse jusqu\'à 3 Gbps',
        'Technologie Tri-Band'
      ],
      certifications: ['CE', 'RoHS'],
      warranty: '3 ans garantie constructeur'
    },
    stock: 'Sur commande',
    rating: 4.9,
    reviews: 78,
    features: [
      'Roaming sans interruption',
      'Contrôle parental',
      'Priorisation des appareils',
      'Configuration facile'
    ]
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Convert the product to the format expected by CartContext
    const cartProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      images: product.images,
      price: product.promo 
        ? product.price * (1 - product.promo.percentage / 100) 
        : product.price,
      stock: 100, // Default stock value
      status: 'active',
      seo_keywords: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    addToCart(cartProduct);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl overflow-hidden h-full flex flex-col"
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
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

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
              : product.stock === 'Sur commande'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {product.stock}
          </span>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 px-4 py-2 rounded-full bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
            onClick={handleAddToCart}
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

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
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