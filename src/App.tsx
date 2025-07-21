import React, { useState } from 'react';
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
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
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
    return <Navbar user={user} onLogout={handleLogout} />;
  };

  return (
    <Router>
      <div className="App">
        <NavbarWrapper />
        <Routes>
          {/* Landing Page */}
          <Route path="/landing" element={<LandingPage />} />
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />
          {/* Home Page */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/home" element={<HomePage />} />
          {/* Filter Page */}
          <Route path="/filter" element={<FilterPage />} />
          {/* Favorites Page */}
          <Route path="/favorites" element={<FavoritesPage />} />
          {/* Admin Panel Pages */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
