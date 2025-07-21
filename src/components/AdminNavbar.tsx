import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/projects', label: 'Projects' },
  { path: '/admin/users', label: 'Users' },
];

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 ml-4">Admin Panel</span>
          </Link>
          <div className="flex items-center space-x-8">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 