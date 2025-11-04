import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaHeart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

interface UserDashboardPageProps {
  onLogout: () => void;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = authAPI.getStoredUser();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleNavigateToFavorites = () => {
    navigate('/favorites');
  };

  const handleNavigateToFilter = () => {
    navigate('/filter');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">
                Your ProjectXplorer dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
              </div>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button> */}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 justify-items-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer w-full max-w-sm"
            onClick={handleNavigateToFilter}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaSearch className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Explore Projects</h3>
                <p className="text-gray-600 text-sm">Discover new projects to work on</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer w-full max-w-sm"
            onClick={handleNavigateToFavorites}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaHeart className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Favorites</h3>
                <p className="text-gray-600 text-sm">View your saved projects</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ProjectXplorer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-md text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">ProjectXplorer Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <p className="text-3xl font-bold text-blue-600">124</p>
              <p className="text-gray-700 mt-2">Projects Completed This Week</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <p className="text-3xl font-bold text-red-600">ChatGPT Clone</p>
              <p className="text-gray-700 mt-2">Most Favorited Project</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
              <p className="text-3xl font-bold text-green-600">542</p>
              <p className="text-gray-700 mt-2">Total Active Users</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm italic">
            Keep exploring, building, and marking your favorites!
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default UserDashboardPage;
