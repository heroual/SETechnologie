import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  User, 
  AtSign,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Votre message a été envoyé avec succès!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Contactez-nous
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Nous sommes à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets technologiques.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sujet *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Demande de devis">Demande de devis</option>
                    <option value="Support technique">Support technique</option>
                    <option value="Information produit">Information produit</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Votre message..."
                  required
                />
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
                    Envoyer le message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mr-4">
                    <Phone className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <p className="text-gray-300">0808551720</p>
                    <p className="text-sm text-gray-400 mt-1">Du lundi au vendredi, 9h-18h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mr-4">
                    <Mail className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">contact@setechnologie.ma</p>
                    <p className="text-sm text-gray-400 mt-1">Nous répondons sous 24h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mr-4">
                    <MapPin className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-gray-300">Agadir, Maroc</p>
                    <p className="text-sm text-gray-400 mt-1">Rendez-vous sur place disponible</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 mr-4">
                    <Clock className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horaires d'ouverture</h3>
                    <p className="text-gray-300">Lundi - Vendredi: 9h - 18h</p>
                    <p className="text-gray-300">Samedi: 9h - 13h</p>
                    <p className="text-gray-300">Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4">Besoin d'une réponse rapide?</h2>
              <p className="text-gray-300 mb-4">
                Pour toute demande urgente, n'hésitez pas à nous appeler directement.
              </p>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:0808551720"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[var(--primary)] text-white hover:bg-[var(--primary)]/10 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Appeler maintenant
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Nous trouver</h2>
          <div className="rounded-xl overflow-hidden h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109064.83295521764!2d-9.6518599!3d30.4198247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e9daad1cc9%3A0x76d41b9c32933f4b!2sAgadir%2080000%2C%20Morocco!5e0!3m2!1sen!2sus!4v1708802000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;