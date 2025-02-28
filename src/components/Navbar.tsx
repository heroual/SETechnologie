import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Cpu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: 'Accueil', href: '/' },
    { title: 'Produits', href: '/products' },
    { title: 'Services', href: '/services' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 backdrop-blur-lg bg-black/70' : 'py-4 glass-effect'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link to="/" className="flex items-center space-x-2">
                <Cpu className="h-8 w-8 text-[var(--primary)]" />
                <span className="text-xl font-bold hero-gradient">SE Technologie</span>
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {menuItems.map((item) => (
                <motion.div key={item.title} whileHover={{ scale: 1.05 }}>
                  <Link
                    to={item.href}
                    className={`text-gray-300 hover:text-white transition-colors ${
                      location.pathname === item.href ? 'text-white font-medium' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-full bg-[var(--primary)] text-white neon-glow"
              >
                Demander un devis
              </motion.button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden backdrop-blur-lg bg-black/90 border-t border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? 'text-white bg-[var(--primary)]/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <button className="w-full mt-4 px-4 py-2 rounded-full bg-[var(--primary)] text-white neon-glow">
              Demander un devis
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;