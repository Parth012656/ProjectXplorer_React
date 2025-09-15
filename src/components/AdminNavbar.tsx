import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { authAPI } from '../services/api';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/projects', label: 'Projects' },
  { path: '/admin/users', label: 'Users' },
];

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authAPI.getStoredUser();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 ml-4">Admin Panel</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            {/* Navigation Items */}
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* User Info and Logout */}
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
              {user && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <FaUser className="text-blue-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 