import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Shield, 
  Wrench, 
  GraduationCap,
  ChevronRight,
  MessageSquareQuote,
  Calendar,
  PhoneCall,
  FileText,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '../contexts/ServiceContext';

interface Testimonial {
  content: string;
  author: string;
  position: string;
  company: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    content: "Grâce à SE Technologie, notre réseau est désormais fiable et performant. Leur équipe est professionnelle et réactive.",
    author: "Ahmed Benali",
    position: "Responsable IT",
    company: "TechMaroc",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  {
    content: "Une équipe exceptionnelle qui a su répondre à nos besoins en matière de sécurité. Installation impeccable et service client au top !",
    author: "Sarah Alami",
    position: "Directrice",
    company: "InnovSpace",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  }
];

const ServiceCard = ({ service }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-effect rounded-2xl overflow-hidden"
  >
    <div className="relative h-48">
      <img
        src={service.image || 'https://via.placeholder.com/300'}
        alt={service.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <div className="p-2 rounded-lg bg-[var(--primary)]/20 backdrop-blur-sm inline-block mb-2">
          {service.category === 'Réseau' ? (
            <Wifi className="w-8 h-8" />
          ) : service.category === 'Sécurité' ? (
            <Shield className="w-8 h-8" />
          ) : service.category === 'Support' ? (
            <Wrench className="w-8 h-8" />
          ) : (
            <GraduationCap className="w-8 h-8" />
          )}
        </div>
        <h3 className="text-xl font-bold">{service.name}</h3>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-300 mb-6">{service.description}</p>
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--primary)] mb-2">Détails</h4>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Type de tarification:</span>
          <span className="text-sm font-medium">
            {service.pricing_type === 'fixed' ? 'Prix fixe' : 'Sur devis'}
          </span>
        </div>
        {service.pricing_type === 'fixed' && service.price && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-300">Prix:</span>
            <span className="text-sm font-medium hero-gradient">{service.price} MAD</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-300">Statut:</span>
          <span className={`text-sm font-medium ${service.status === 'available' ? 'text-green-400' : 'text-red-400'}`}>
            {service.status === 'available' ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>

      <Link to="/quote-request" className="inline-block w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Demander un devis
        </motion.button>
      </Link>
    </div>
  </motion.div>
);

const ProcessStep = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center text-center"
  >
    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-4 neon-glow">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="glass-effect rounded-xl p-6"
  >
    <MessageSquareQuote className="w-8 h-8 text-[var(--primary)] mb-4" />
    <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
    <div className="flex items-center">
      <img
        src={testimonial.image}
        alt={testimonial.author}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="font-semibold">{testimonial.author}</h4>
        <p className="text-sm text-gray-400">{testimonial.position} - {testimonial.company}</p>
      </div>
    </div>
  </motion.div>
);

const Services = () => {
  const { services, loading, error } = useServices();

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
            Nos Services
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            À SE Technologie, nous vous proposons des solutions sur-mesure pour optimiser votre environnement technologique avec des services d'installation, de maintenance et de support dédiés à votre satisfaction.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 text-[var(--primary)] animate-spin" />
            <span className="ml-4 text-lg">Chargement des services...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 glass-effect rounded-xl p-8">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 hero-gradient">
            Notre Processus
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep
              icon={<Calendar className="w-8 h-8 text-[var(--primary)]" />}
              title="Consultation Initiale"
              description="Rencontre pour évaluer vos besoins et définir les solutions adaptées"
            />
            <ProcessStep
              icon={<Wrench className="w-8 h-8 text-[var(--primary)]" />}
              title="Installation & Configuration"
              description="Mise en place professionnelle des équipements et systèmes"
            />
            <ProcessStep
              icon={<PhoneCall className="w-8 h-8 text-[var(--primary)]" />}
              title="Suivi & Support"
              description="Assistance continue et maintenance régulière de vos installations"
            />
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 hero-gradient">
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Prêt à optimiser votre infrastructure ?</h2>
          <p className="text-gray-300 mb-8">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et découvrez comment nous pouvons vous aider.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/quote-request">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full bg-[var(--primary)] text-white neon-glow flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Demander un devis gratuit
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full border border-[var(--primary)] text-white flex items-center justify-center"
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Nous contacter
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;