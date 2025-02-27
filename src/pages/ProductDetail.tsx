import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Share2,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Info
} from 'lucide-react';
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Find product by ID
        const foundProduct = products.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error('Produit non trouvé');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    toast.success(`${product?.name} ajouté au panier`);
  };

  const handleAddToWishlist = () => {
    toast.success(`${product?.name} ajouté aux favoris`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié dans le presse-papier');
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 flex flex-col justify-center items-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
        <Link to="/products" className="text-[var(--primary)] hover:underline">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const discountedPrice = product.promo 
    ? product.price * (1 - product.promo.percentage / 100) 
    : product.price;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux produits
          </Link>
        </div>

        {/* Product Overview */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-effect rounded-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-[400px] object-cover"
                />
                {product.promo && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{product.promo.percentage}%
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index 
                      ? 'border-[var(--primary)]' 
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{product.category}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{product.rating} ({product.reviews} avis)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            </div>

            <p className="text-gray-300">{product.description}</p>

            <div className="flex items-end">
              <div className="mr-4">
                <span className="text-3xl font-bold hero-gradient">
                  {discountedPrice.toFixed(2)} MAD
                </span>
                {product.promo && (
                  <span className="text-sm line-through ml-2 text-gray-400">
                    {product.price} MAD
                  </span>
                )}
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${
                product.stock === 'En stock' 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {product.stock}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Quantité:</span>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 rounded-l-lg bg-white/5 border border-white/10 hover:bg-white/10"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-12 px-2 py-1 text-center bg-white/5 border-t border-b border-white/10"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 rounded-r-lg bg-white/5 border border-white/10 hover:bg-white/10"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToWishlist}
                className="px-4 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="px-4 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Shipping Info */}
            <div className="glass-effect rounded-xl p-4 space-y-3">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-[var(--primary)] mr-3" />
                <span className="text-sm">Livraison gratuite à partir de 1000 MAD</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-[var(--primary)] mr-3" />
                <span className="text-sm">Garantie {product.specs.warranty}</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-[var(--primary)] mr-3" />
                <span className="text-sm">Retour gratuit sous 14 jours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="glass-effect rounded-2xl overflow-hidden mb-16">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-[var(--primary)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-[var(--primary)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Spécifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[var(--primary)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Avis ({product.reviews})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <p className="text-gray-300">{product.description}</p>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Caractéristiques principales</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-[var(--primary)] mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informations techniques</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-3 text-gray-400">Dimensions</td>
                          <td className="py-3">{product.specs.dimensions}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-3 text-gray-400">Poids</td>
                          <td className="py-3">{product.specs.weight}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-3 text-gray-400">Garantie</td>
                          <td className="py-3">{product.specs.warranty}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Compatibilité</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.specs.compatibility.map((item, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/5 text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.specs.certifications.map((cert, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/5 text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Spécifications détaillées</h3>
                  <ul className="space-y-3">
                    {product.specs.specifications.map((spec, index) => (
                      <li key={index} className="flex items-start">
                        <Info className="h-5 w-5 text-[var(--primary)] mr-2 flex-shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      <span className="ml-2 text-2xl font-bold">{product.rating}</span>
                      <span className="ml-2 text-gray-400">sur 5</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Basé sur {product.reviews} avis</p>
                  </div>
                  
                  <button className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white">
                    Écrire un avis
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Sample reviews */}
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Ahmed K.</h4>
                        <p className="text-sm text-gray-400">Il y a 2 semaines</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Excellent produit, très satisfait de la performance. Installation facile et interface intuitive.
                    </p>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">Sophia M.</h4>
                        <p className="text-sm text-gray-400">Il y a 1 mois</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Très bon rapport qualité-prix. La couverture est excellente et la configuration est simple. Je retire une étoile car le manuel d'utilisation pourrait être plus détaillé.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.filter(p => p.id !== product.id).map(relatedProduct => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-effect rounded-2xl overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  {relatedProduct.promo && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{relatedProduct.promo.percentage}%
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{relatedProduct.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{relatedProduct.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{relatedProduct.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold hero-gradient">
                      {relatedProduct.promo 
                        ? (relatedProduct.price * (1 - relatedProduct.promo.percentage / 100)).toFixed(2)
                        : relatedProduct.price} MAD
                    </span>
                    <Link 
                      to={`/products/${relatedProduct.id}`}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;