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
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
  advantages: string[];
  details: string[];
  image: string;
}

interface Testimonial {
  content: string;
  author: string;
  position: string;
  company: string;
  image: string;
}

const services: Service[] = [
  {
    icon: <Wifi className="w-8 h-8" />,
    title: 'Installation et Configuration de Réseaux Wi-Fi',
    description: 'Installation de réseaux Wi-Fi à haut débit, en intérieur comme en extérieur, avec des points d\'accès optimisés pour une couverture totale.',
    advantages: [
      'Couverture Wi-Fi optimale',
      'Installation rapide et professionnelle',
      'Support technique dédié'
    ],
    details: [
      'Configuration de routeurs',
      'Installation de mesh Wi-Fi',
      'Configuration de switchs PoE',
      'Sécurisation du réseau'
    ],
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Vidéosurveillance et Sécurité',
    description: 'Installation de systèmes de vidéosurveillance intelligents pour la sécurité de votre maison ou entreprise, avec des caméras haute définition et un stockage sécurisé.',
    advantages: [
      'Surveillance 24/7',
      'Accès à distance via mobile',
      'Stockage cloud sécurisé'
    ],
    details: [
      'Installation de caméras IP',
      'Configuration NVR',
      'Systèmes d\'alarme',
      'Intégration domotique'
    ],
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb'
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Maintenance Informatique et Réseaux',
    description: 'Maintenance régulière de vos équipements informatiques et réseaux pour garantir une performance optimale et prévenir les pannes.',
    advantages: [
      'Maintenance préventive',
      'Intervention rapide',
      'Suivi personnalisé'
    ],
    details: [
      'Dépannage matériel et logiciel',
      'Gestion des réseaux',
      'Mise à jour firmware',
      'Diagnostic réseau'
    ],
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780'
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Support Technique & Formation',
    description: 'Support technique dédié et sessions de formation pour vos équipes afin d\'optimiser l\'utilisation de vos technologies.',
    advantages: [
      'Formation sur mesure',
      'Support continu',
      'Documentation détaillée'
    ],
    details: [
      'Formation équipements IT',
      'Gestion des réseaux',
      'Bonnes pratiques sécurité',
      'Utilisation des outils'
    ],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c'
  }
];

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

const ServiceCard = ({ service }: { service: Service }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-effect rounded-2xl overflow-hidden"
  >
    <div className="relative h-48">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <div className="p-2 rounded-lg bg-[var(--primary)]/20 backdrop-blur-sm inline-block mb-2">
          {service.icon}
        </div>
        <h3 className="text-xl font-bold">{service.title}</h3>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-300 mb-6">{service.description}</p>
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[var(--primary)] mb-2">Avantages</h4>
        <ul className="space-y-2">
          {service.advantages.map((advantage, index) => (
            <li key={index} className="flex items-center text-sm text-gray-300">
              <ChevronRight className="w-4 h-4 text-[var(--primary)] mr-2" />
              {advantage}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[var(--primary)] mb-2">Détails techniques</h4>
        <ul className="space-y-2">
          {service.details.map((detail, index) => (
            <li key={index} className="flex items-center text-sm text-gray-300">
              <ChevronRight className="w-4 h-4 text-[var(--primary)] mr-2" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map(service => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

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