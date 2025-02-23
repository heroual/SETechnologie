import React from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Target,
  Award,
  Users,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Lightbulb,
  Shield,
  Heart,
  ThumbsUp
} from 'lucide-react';

interface Value {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface Achievement {
  number: string;
  label: string;
  icon: JSX.Element;
}

const values: Value[] = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Innovation',
    description: 'Nous croyons fermement à l\'innovation pour répondre aux besoins croissants de connectivité et de sécurité.'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Qualité',
    description: 'Tous nos produits et services sont soigneusement sélectionnés et testés pour garantir une fiabilité maximale.'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Proximité',
    description: 'En tant que startup marocaine, nous sommes proches de nos clients et toujours à l\'écoute pour offrir des solutions adaptées.'
  },
  {
    icon: <ThumbsUp className="w-8 h-8" />,
    title: 'Satisfaction Client',
    description: 'Nous mettons un point d\'honneur à fournir un service client de qualité, réactif et personnalisé.'
  }
];

const achievements: Achievement[] = [
  {
    number: '500+',
    label: 'Clients Satisfaits',
    icon: <Users className="w-6 h-6" />
  },
  {
    number: '1000+',
    label: 'Installations Réussies',
    icon: <Target className="w-6 h-6" />
  },
  {
    number: '24/7',
    label: 'Support Technique',
    icon: <Clock className="w-6 h-6" />
  },
  {
    number: '4.9/5',
    label: 'Note Client',
    icon: <Star className="w-6 h-6" />
  }
];

const About = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl font-bold mb-6 hero-gradient">
            Qui Sommes-Nous ?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            SE Technologie est une startup marocaine spécialisée dans la vente et l'installation de solutions IoT, réseau et IT pour particuliers et entreprises.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-effect rounded-2xl p-8 mb-20"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center neon-glow">
              <Rocket className="w-8 h-8 text-[var(--primary)]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Notre Mission</h2>
          <p className="text-gray-300 text-center text-lg max-w-3xl mx-auto">
            "Chez SE Technologie, notre objectif est de rendre chaque maison et entreprise plus connectée, sécurisée et performante. Nous proposons des produits innovants et des services professionnels afin de garantir une performance optimale et une expérience utilisateur exceptionnelle."
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 hero-gradient">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4 neon-glow">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-3xl font-bold hero-gradient mb-2">{achievement.number}</h3>
                <p className="text-gray-300">{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Objectives Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-effect rounded-2xl p-8 mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Nos Objectifs</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              'Devenir un leader local dans le domaine des solutions IoT et réseaux au Maroc.',
              'Fournir des services personnalisés à nos clients pour répondre à leurs besoins spécifiques.',
              'Promouvoir l\'utilisation des technologies de pointe pour améliorer la vie quotidienne des Marocains.'
            ].map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <ChevronRight className="w-5 h-5 text-[var(--primary)] mr-3 flex-shrink-0" />
                <p className="text-gray-300">{objective}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Nos Coordonnées</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Adresse</h3>
                <p className="text-gray-300 text-sm">Casablanca, Maroc</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Téléphone</h3>
                <p className="text-gray-300 text-sm">0808551720</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Horaires</h3>
                <p className="text-gray-300 text-sm">Lun-Ven: 9h-18h</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;