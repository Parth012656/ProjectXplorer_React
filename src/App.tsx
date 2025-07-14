import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FilterPage from './pages/FilterPage';
import FavoritesPage from './pages/FavoritesPage';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar - Show on all pages except landing */}
        <Routes>
          <Route path="/landing" element={null} />
          <Route path="*" element={<Navbar user={user} onLogout={handleLogout} />} />
        </Routes>

        <AnimatePresence mode="wait">
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
            
            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
