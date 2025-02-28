import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Home as HomeIcon, ChevronRight, Star, Users, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const products = [
    {
      icon: <HomeIcon className="h-8 w-8" />,
      title: 'Smart Home',
      description: 'Solutions domotiques intelligentes pour votre maison',
      link: '/products'
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: 'Réseau & Wi-Fi',
      description: 'Connectivité haute performance pour entreprises et particuliers',
      link: '/products'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Sécurité',
      description: 'Systèmes de surveillance et protection avancés',
      link: '/products'
    }
  ];

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

      {/* Products Section */}
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
              Nos Solutions
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Des produits innovants pour répondre à vos besoins technologiques, conçus pour améliorer votre quotidien
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 hover:neon-glow transition-all duration-300"
              >
                <div className="text-[var(--primary)] mb-4">{product.icon}</div>
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <Link to={product.link}>
                  <motion.div
                    className="inline-flex items-center text-[var(--primary)] cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    En savoir plus <ChevronRight className="ml-1 h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full bg-[var(--primary)] text-white neon-glow"
            >
              Demander un devis gratuit
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;