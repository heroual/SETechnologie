import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Home as HomeIcon, ChevronRight, Star, Users, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useServices } from '../contexts/ServiceContext';

const Home = () => {
  const { products, loading: productsLoading } = useProducts();
  const { services, loading: servicesLoading } = useServices();
  
  // Featured products and services
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    // Get featured products (first 3 active products)
    if (!productsLoading && products.length > 0) {
      const activeProducts = products
        .filter(product => product.status === 'active')
        .slice(0, 3);
      setFeaturedProducts(activeProducts);
    }

    // Get featured services
    if (!servicesLoading && services.length > 0) {
      const featured = services
        .filter(service => service.featured && service.status === 'available')
        .slice(0, 3);
      setFeaturedServices(featured);
    }
  }, [products, services, productsLoading, servicesLoading]);

  const stats = [
    { icon: <Users />, value: '500+', label: 'Clients Satisfaits' },
    { icon: <Award />, value: '10+', label: 'Années d\'Expérience' },
    { icon: <Star />, value: '4.9/5', label: 'Note Client' },
    { icon: <Clock />, value: '24/7', label: 'Support Technique' }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
            alt="Technology Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 hero-gradient">
              L'avenir connecté commence ici
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Solutions IoT, réseau et IT innovantes pour votre entreprise et votre maison
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 sm:px-8 py-3 rounded-full bg-[var(--primary)] text-white neon-glow w-full sm:w-auto"
                >
                  Découvrir nos produits
                </motion.button>
              </Link>
              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 sm:px-8 py-3 rounded-full border border-[var(--primary)] text-white w-full sm:w-auto"
                >
                  Nos services
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl sm:text-3xl font-bold hero-gradient mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 hero-gradient">
              Nos Produits Vedettes
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Découvrez notre sélection de produits innovants pour améliorer votre quotidien
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 hover:neon-glow transition-all duration-300"
              >
                <div className="h-48 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={product.images[0] || 'https://via.placeholder.com/300'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold hero-gradient">{product.price} MAD</span>
                  <Link to={`/products/${product.id}`}>
                    <motion.div
                      className="inline-flex items-center text-[var(--primary)] cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      En savoir plus <ChevronRight className="ml-1 h-4 w-4" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg border border-[var(--primary)] text-white hover:bg-[var(--primary)]/10 transition-colors"
              >
                Voir tous nos produits
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 hero-gradient">
              Nos Services
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Des solutions professionnelles pour répondre à tous vos besoins technologiques
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={service.image || 'https://via.placeholder.com/300'}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{service.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 mb-4 line-clamp-2">{service.description}</p>
                  <Link to="/quote-request">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow"
                    >
                      Demander un devis
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg border border-[var(--primary)] text-white hover:bg-[var(--primary)]/10 transition-colors"
              >
                Voir tous nos services
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-black/0 to-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Prêt à transformer votre environnement technologique?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nos solutions peuvent vous aider.
            </p>
            <Link to="/quote-request">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 rounded-full bg-[var(--primary)] text-white neon-glow"
              >
                Demander un devis gratuit
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;