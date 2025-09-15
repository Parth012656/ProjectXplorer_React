import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FilterPage from './pages/FilterPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import UserDashboardPage from './pages/UserDashboardPage';
import { User, AuthUser } from './types';
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = authAPI.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: AuthUser) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  // Custom hook to get current location
  const usePath = () => {
    const location = useLocation();
    return location.pathname;
  };

  const NavbarWrapper = () => {
    const path = usePath();
    // Hide Navbar on /landing, /login, and all /admin pages
    if (path === '/landing' || path === '/login' || path.startsWith('/admin')) return null;
    
    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-2xl font-bold text-blue-600 ml-4">ProjectXplorer</div>
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      );
    }
    
    return <Navbar user={user} onLogout={handleLogout} />;
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }: { 
    children: React.ReactNode; 
    requireAuth?: boolean; 
    requireAdmin?: boolean; 
  }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (requireAuth && !user) {
      return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
      return <Navigate to="/user-dashboard" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Router>
      <div className="App">
        <NavbarWrapper />
        <Routes>
          {/* Landing Page */}
          <Route path="/landing" element={<LandingPage />} />
          {/* Login Page */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          {/* Home Page */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/home" element={<HomePage />} />
          {/* Filter Page */}
          <Route path="/filter" element={<FilterPage />} />
          {/* Favorites Page */}
          <Route path="/favorites" element={<FavoritesPage />} />
          {/* User Dashboard */}
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute requireAuth={true}>
                <UserDashboardPage onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          {/* Admin Panel Pages */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminProjectsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
