import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft, 
  Check,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { sendOrderConfirmation } from '../services/emailService';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'transfer' | 'cash';
  notes: string;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      navigate('/cart');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, you would send this data to your backend
      // For demo purposes, we'll just simulate a successful order
      
      // Create order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        shipping: {
          method: formData.shippingMethod,
          cost: formData.shippingMethod === 'express' ? 100 : 50
        },
        payment: {
          method: formData.paymentMethod,
          total: totalPrice + (formData.shippingMethod === 'express' ? 100 : 50)
        },
        notes: formData.notes,
        orderDate: new Date().toISOString(),
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`
      };
      
      // Send order confirmation email
      await sendOrderConfirmation(formData.email, orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to success page
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: orderData.orderNumber,
          orderTotal: orderData.payment.total
        } 
      });
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Une erreur est survenue lors du traitement de votre commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
          !formData.address || !formData.city || !formData.postalCode) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Veuillez entrer une adresse email valide');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Calculate shipping cost
  const shippingCost = formData.shippingMethod === 'express' ? 100 : 50;
  const orderTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8 text-center"
          >
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
            <h1 className="text-3xl font-bold mb-4">Panier vide</h1>
            <p className="text-gray-300 mb-8">
              Votre panier est vide. Veuillez ajouter des produits avant de passer à la caisse.
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
        <div className="mb-8">
          <Link to="/cart" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour au panier
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

        {/* Checkout Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[var(--primary)] text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <User className="h-5 w-5" />
            </div>
            <div className={`w-16 h-1 ${
              step >= 2 ? 'bg-[var(--primary)]' : 'bg-white/10'
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[var(--primary)] text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <Truck className="h-5 w-5" />
            </div>
            <div className={`w-16 h-1 ${
              step >= 3 ? 'bg-[var(--primary)]' : 'bg-white/10'
            }`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-[var(--primary)] text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl p-6"
            >
              <form onSubmit={handleSubmit}>
                {/* Step 1: Customer Information */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Adresse *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Method */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Méthode de livraison</h2>
                    
                    <div className="space-y-4">
                      <label className="block glass-effect rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-white/20 transition-colors">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="standard"
                            checked={formData.shippingMethod === 'standard'}
                            onChange={handleChange}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Livraison standard</div>
                              <div className="font-semibold">50 MAD</div>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Livraison en 3-5 jours ouvrables
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="block glass-effect rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-white/20 transition-colors">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === 'express'}
                            onChange={handleChange}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Livraison express</div>
                              <div className="font-semibold">100 MAD</div>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Livraison en 1-2 jours ouvrables
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Notes de livraison (optionnel)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                        placeholder="Instructions spéciales pour la livraison..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Méthode de paiement</h2>
                    
                    <div className="space-y-4">
                      <label className="block glass-effect rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-white/20 transition-colors">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleChange}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Carte bancaire</div>
                            <div className="text-sm text-gray-400 mt-1">
                              Paiement sécurisé par carte bancaire
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="block glass-effect rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-white/20 transition-colors">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="transfer"
                            checked={formData.paymentMethod === 'transfer'}
                            onChange={handleChange}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Virement bancaire</div>
                            <div className="text-sm text-gray-400 mt-1">
                              Les détails du virement vous seront envoyés par email
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="block glass-effect rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-white/20 transition-colors">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === 'cash'}
                            onChange={handleChange}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Paiement à la livraison</div>
                            <div className="text-sm text-gray-400 mt-1">
                              Payez en espèces à la réception de votre commande
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="mt-8 p-4 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-500">Important</p>
                          <p className="text-gray-300 mt-1">
                            En cliquant sur "Confirmer la commande", vous acceptez nos conditions générales de vente et notre politique de confidentialité.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                    >
                      Précédent
                    </motion.button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="button"
                      onClick={nextStep}
                      className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow"
                    >
                      Suivant
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        'Traitement...'
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Confirmer la commande
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>
              
              <div className="max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center py-3 border-b border-white/10">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || 'https://via.placeholder.com/100'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{item.product.name}</div>
                        <div>{(item.product.price * item.quantity).toFixed(2)} MAD</div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Quantité: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Livraison</span>
                  <span>{shippingCost.toFixed(2)} MAD</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl hero-gradient">{orderTotal.toFixed(2)} MAD</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <p>Étape {step} sur 3</p>
                <p className="mt-2">
                  {step === 1 && "Veuillez remplir vos informations personnelles."}
                  {step === 2 && "Choisissez votre méthode de livraison."}
                  {step === 3 && "Sélectionnez votre méthode de paiement pour finaliser la commande."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;