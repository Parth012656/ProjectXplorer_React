import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import AuthComponent from '../components/AuthComponent';
import { User } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    // In a real app, you would store the user in context or state management
    console.log('User logged in:', user);
    navigate('/');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </motion.button>

        {/* Auth Component as standalone page content */}
        <AuthComponent onLogin={handleLogin} onClose={handleClose} />
      </motion.div>
    </div>
  );
};

export default LoginPage; 