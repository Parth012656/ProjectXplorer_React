import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaCog, FaHeart, FaSearch } from 'react-icons/fa';
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
                <FaUser />
                <span className="text-sm">{user?.role}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
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
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
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

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FaCog className="text-gray-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-gray-600 text-sm">Manage your account settings</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activity to show</p>
            <p className="text-gray-400 text-sm mt-2">Start exploring projects to see your activity here</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
