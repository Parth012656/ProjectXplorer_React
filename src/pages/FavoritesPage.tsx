import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { Project } from '../types';
import { projectAPI, getProjectsByAll, getProjectDescriptionById } from '../services/api';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  React.useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await projectAPI.getFavoriteProjects('1');
      setFavorites(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (project: Project) => {
    try {
      await projectAPI.toggleFavorite(project, '1');
      loadFavorites(); // Reload favorites after toggle
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setDetailsLoading(true);
    try {
      const details = await getProjectDescriptionById(project.description.desIid);
      setProjectDetails(details);
    } catch (e) {
      setProjectDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setProjectDetails(null);
  };

  const handleClearAllFavorites = async () => {
    try {
      setFavorites([]);
      localStorage.setItem('favorites_1', JSON.stringify([]));
      window.dispatchEvent(new Event('favorites:clearAll'));
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
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
            {/* <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <FaArrowLeft />
                <span>Back to Home</span>
              </motion.button>
            </div> */}

            {favorites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAllFavorites}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FaTrash />
                <span>Clear All</span>
              </motion.button>
            )}
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600">
              Your saved projects and bookmarks
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && favorites.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">💔</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No favorites yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring projects and add them to your favorites to see them here
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/filter')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Explore Projects
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Favorites Grid */}
          {!loading && favorites.length > 0 && (
            <>
              {/* Stats */}
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaHeart className="text-red-500" />
                    <span className="text-lg font-semibold text-gray-900">
                      {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((project, index) => (
                  <motion.div
                    key={project.pId || project.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard
                      project={project}
                      isFavorite={true}
                      onFavoriteToggle={() => handleFavoriteToggle(project)}
                      onClick={handleProjectClick}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 bg-white rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/filter')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Find More Projects
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            details={projectDetails}
            loading={detailsLoading}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default FavoritesPage; 