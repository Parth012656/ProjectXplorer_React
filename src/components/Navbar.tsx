import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaHeart, FaSignInAlt, FaSignOutAlt, FaUser, FaSearch } from 'react-icons/fa';
import { AuthUser } from '../types';

interface NavbarProps {
  user: AuthUser | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  // const getNavItems = () => {
  //   const baseItems = [
  //     { path: '/home', label: 'Home', icon: <FaHome /> },
  //     { path: '/filter', label: 'Explore', icon: <FaSearch /> },
  //     { path: '/favorites', label: 'Favorites', icon: <FaHeart /> },
  //   ];

  //   if (user) {
  //     // Add dashboard link for authenticated users
  //     if (user.role === 'admin') {
  //       baseItems.push({ path: '/admin/dashboard', label: 'Admin Dashboard', icon: <FaUser /> });
  //     } else {
  //       baseItems.push({ path: '/user-dashboard', label: 'Dashboard', icon: <FaUser /> });
  //     }
  //   }

  //   return baseItems;
  // };

  const getNavItems = () => {
    const baseItems = [
      { path: '/filter', label: 'Explore', icon: <FaSearch /> },
      { path: '/favorites', label: 'Favorites', icon: <FaHeart /> },
    ];
  
    if (!user) {
      // Only show Home if not logged in
      baseItems.unshift({ path: '/home', label: 'Home', icon: <FaHome /> });
    }
  
    if (user) {
      if (user.role === 'admin') {
        baseItems.push({ path: '/admin/dashboard', label: 'Admin Dashboard', icon: <FaUser /> });
      } else {
        baseItems.push({ path: '/user-dashboard', label: 'Dashboard', icon: <FaUser /> });
      }
    }
  
    return baseItems;
  };
  

  const navItems = getNavItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-blue-600 ml-4"
            >
              ProjectXplorer
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <FaUser className="text-blue-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaSignInAlt />
                  <span className="hidden sm:inline">Login</span>
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Mobile Auth Section */}
          {user && (
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <FaUser className="text-blue-600" />
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 