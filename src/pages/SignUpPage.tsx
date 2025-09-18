import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { RegisterRequest, RegisterResponse } from '../types';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);

  // ✅ Validate form
  useEffect(() => {
    const isValid =
      formData.username.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      formData.password === formData.confirmPassword;
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please fill all fields correctly');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response: RegisterResponse = await authAPI.register(formData);

      if (response.message) {
        alert(response.message + ' Please login now.');
        navigate('/login'); // ✅ don’t auto-login
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        const errorType = err.response.data?.error;
        if (errorType === 'USERNAME_EXISTS') {
          setError('Username already exists. Try another one.');
        } else if (errorType === 'EMAIL_EXISTS') {
          setError('Email already exists. Try another one.');
        } else if (errorType === 'USERNAME_AND_EMAIL_EXISTS') {
          setError('Both username and email already exist. Try new ones.');
        } else {
          setError('Duplicate user found. Please try again.');
        }
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        {/* 🔙 Back to Home */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 font-medium mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </motion.button>

        {/* Form Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="flex items-center border rounded-lg p-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-lg p-2">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-lg p-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border rounded-lg p-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full outline-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm flex items-center">
                <FaExclamationTriangle className="mr-2" /> {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
