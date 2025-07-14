import React from 'react';
import { motion } from 'framer-motion';
import { Domain } from '../types';

interface LandingCardProps {
  domain: Domain;
  onClick: (domain: Domain) => void;
  delay?: number;
}

const LandingCard: React.FC<LandingCardProps> = ({ domain, onClick, delay = 0 }) => {
  const getDomainInfo = (domain: Domain) => {
    switch (domain) {
      case 'AI/ML':
        return {
          icon: '🤖',
          color: 'from-purple-500 to-pink-500',
          description: 'Explore cutting-edge AI and machine learning projects',
          gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
        };
      case 'Web Development':
        return {
          icon: '🌐',
          color: 'from-blue-500 to-cyan-500',
          description: 'Build modern web applications and websites',
          gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
        };
      case 'IoT':
        return {
          icon: '📡',
          color: 'from-green-500 to-teal-500',
          description: 'Connect the physical world with smart devices',
          gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
        };
      case 'Game Development':
        return {
          icon: '🎮',
          color: 'from-orange-500 to-red-500',
          description: 'Create immersive gaming experiences',
          gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
        };
      case 'Android Development':
        return {
          icon: '📱',
          color: 'from-indigo-500 to-purple-500',
          description: 'Develop powerful mobile applications',
          gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
        };
      default:
        return {
          icon: '💻',
          color: 'from-gray-500 to-gray-600',
          description: 'Explore various programming projects',
          gradient: 'bg-gradient-to-br from-gray-500 to-gray-600',
        };
    }
  };

  const domainInfo = getDomainInfo(domain);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ 
        y: -10,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
      onClick={() => onClick(domain)}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${domainInfo.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative p-8">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="text-6xl mb-4"
          >
            {domainInfo.icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
            {domain}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {domainInfo.description}
          </p>

          {/* Explore Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium ${domainInfo.gradient} shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            Explore Projects
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="ml-2"
            >
              →
            </motion.span>
          </motion.div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          delay: delay * 0.2
        }}
        className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-lg opacity-60"
      />
      
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          delay: delay * 0.3
        }}
        className="absolute -bottom-2 -left-2 w-3 h-3 bg-white rounded-full shadow-lg opacity-40"
      />
    </motion.div>
  );
};

export default LandingCard; 