import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash, 
  Plus, 
  Minus, 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  Shield,
  Save,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, saveCart, totalItems, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    
    setIsCheckingOut(true);
    saveCart();
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8 text-center"
          >
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-gray-300 mb-8">
              Vous n'avez pas encore ajouté de produits à votre panier.
            </p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center mx-auto"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Découvrir nos produits
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Votre Panier</h1>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => saveCart()}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Sauvegarder
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => clearCart()}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors flex items-center text-red-400"
            >
              <Trash className="h-5 w-5 mr-2" />
              Vider le panier
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0] || 'https://via.placeholder.com/100'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-400">{item.product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-red-400"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold hero-gradient">
                    {(item.product.price * item.quantity).toFixed(2)} MAD
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.product.price.toFixed(2)} MAD / unité
                  </div>
                </div>
              </motion.div>
            ))}
            
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex items-center text-[var(--primary)] hover:underline mt-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Continuer mes achats
              </motion.button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Livraison</span>
                  <span>Calculé à l'étape suivante</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl hero-gradient">{totalPrice.toFixed(2)} MAD</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center justify-center disabled:opacity-50"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {isCheckingOut ? 'Chargement...' : 'Passer à la caisse'}
              </motion.button>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <Truck className="h-4 w-4 mr-2 text-[var(--primary)]" />
                  Livraison gratuite à partir de 1000 MAD
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Shield className="h-4 w-4 mr-2 text-[var(--primary)]" />
                  Paiement sécurisé
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;