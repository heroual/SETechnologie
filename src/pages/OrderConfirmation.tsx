import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, FileText } from 'lucide-react';

interface LocationState {
  orderNumber: string;
  orderTotal: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  // Redirect if no order data is available
  if (!state || !state.orderNumber) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-gray-300 mb-8">
            Merci pour votre commande. Nous avons bien reçu votre demande et nous la traiterons dans les plus brefs délais.
          </p>
          
          <div className="glass-effect rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-400">Numéro de commande</p>
                <p className="text-xl font-semibold">{state.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Montant total</p>
                <p className="text-xl font-semibold hero-gradient">{state.orderTotal.toFixed(2)} MAD</p>
              </div>
            </div>
            
            <div className="text-left">
              <p className="text-sm text-gray-400 mb-2">Détails de la commande</p>
              <p className="text-sm">
                Un email de confirmation a été envoyé à l'adresse que vous avez fournie avec tous les détails de votre commande.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </motion.button>
            </Link>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continuer mes achats
              </motion.button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-400">
            <p>
              Si vous avez des questions concernant votre commande, n'hésitez pas à{' '}
              <Link to="/contact" className="text-[var(--primary)] hover:underline">
                nous contacter
              </Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;