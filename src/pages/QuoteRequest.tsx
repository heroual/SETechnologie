import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  User, 
  AtSign, 
  Phone, 
  MessageSquare, 
  Building, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  projectDescription: string;
  budget: string;
  timeframe: string;
  preferredContact: 'email' | 'phone';
  termsAccepted: boolean;
}

const QuoteRequest = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    projectDescription: '',
    budget: '',
    timeframe: '',
    preferredContact: 'email',
    termsAccepted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Votre demande de devis a été envoyée avec succès!');
      setSubmitted(true);
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl p-12 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Demande envoyée avec succès!</h1>
            <p className="text-gray-300 mb-8">
              Merci pour votre demande de devis. Notre équipe l'examinera et vous contactera dans les plus brefs délais.
            </p>
            <p className="text-gray-300 mb-8">
              Un email de confirmation a été envoyé à <span className="font-semibold">{formData.email}</span>
            </p>
            <div className="flex justify-center">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow"
                >
                  Retour à l'accueil
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 hero-gradient">
            Demander un devis
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour recevoir un devis personnalisé pour vos besoins en technologie et services IT.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-[var(--primary)]" />
                Informations personnelles
              </h2>
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
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <AtSign className="h-5 w-5 mr-2 text-[var(--primary)]" />
                Coordonnées
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Entreprise
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Nom de votre entreprise (optionnel)"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-[var(--primary)]" />
                Détails du projet
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type de service *
                </label>
                <div className="relative">
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] appearance-none text-white"
                    required
                  >
                    <option value="" className="bg-[#0A0A0F] text-gray-400">Sélectionnez un service</option>
                    <option value="Installation Wi-Fi" className="bg-[#0A0A0F] text-white">Installation Wi-Fi</option>
                    <option value="Vidéosurveillance" className="bg-[#0A0A0F] text-white">Vidéosurveillance</option>
                    <option value="Maintenance IT" className="bg-[#0A0A0F] text-white">Maintenance IT</option>
                    <option value="Support Technique" className="bg-[#0A0A0F] text-white">Support Technique</option>
                    <option value="Smart Home" className="bg-[#0A0A0F] text-white">Smart Home</option>
                    <option value="Autre" className="bg-[#0A0A0F] text-white">Autre</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description du projet *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Décrivez votre projet et vos besoins spécifiques..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget estimé
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] appearance-none text-white"
                    >
                      <option value="" className="bg-[#0A0A0F] text-gray-400">Sélectionnez un budget</option>
                      <option value="< 5 000 MAD" className="bg-[#0A0A0F] text-white">Moins de 5 000 MAD</option>
                      <option value="5 000 - 10 000 MAD" className="bg-[#0A0A0F] text-white">5 000 - 10 000 MAD</option>
                      <option value="10 000 - 20 000 MAD" className="bg-[#0A0A0F] text-white">10 000 - 20 000 MAD</option>
                      <option value="20 000 - 50 000 MAD" className="bg-[#0A0A0F] text-white">20 000 - 50 000 MAD</option>
                      <option value="> 50 000 MAD" className="bg-[#0A0A0F] text-white">Plus de 50 000 MAD</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Délai souhaité
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] appearance-none text-white"
                    >
                      <option value="" className="bg-[#0A0A0F] text-gray-400">Sélectionnez un délai</option>
                      <option value="Urgent (< 1 semaine)" className="bg-[#0A0A0F] text-white">Urgent (moins d'une semaine)</option>
                      <option value="1-2 semaines" className="bg-[#0A0A0F] text-white">1-2 semaines</option>
                      <option value="2-4 semaines" className="bg-[#0A0A0F] text-white">2-4 semaines</option>
                      <option value="1-2 mois" className="bg-[#0A0A0F] text-white">1-2 mois</option>
                      <option value="> 2 mois" className="bg-[#0A0A0F] text-white">Plus de 2 mois</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[var(--primary)]" />
                Préférences
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Méthode de contact préférée
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleChange}
                      className="mr-2 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleChange}
                      className="mr-2 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    Téléphone
                  </label>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="w-4 h-4 rounded bg-white/5 border border-white/10 focus:ring-[var(--primary)] text-[var(--primary)]"
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                  J'accepte que mes données soient traitées conformément à la <Link to="/privacy" className="text-[var(--primary)] hover:underline">politique de confidentialité</Link> de SE Technologie.
                </label>
              </div>
              
              <div className="flex items-center p-4 mb-6 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" role="alert">
                <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-2" />
                <span>Nous vous contacterons dans un délai de 24 à 48 heures ouvrables après réception de votre demande.</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Demander un devis gratuit
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QuoteRequest;