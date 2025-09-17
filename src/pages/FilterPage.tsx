import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FilterPanel from '../components/FilterComponent';
import ProjectCard from '../components/ProjectCard';
import { Project, FilterOptions } from '../types';
import {
  getProjectsByAll,
  getProjectsByRatingArea,
  getProjectsByAreaDifficulty,
  getProjectsByDifficultyRating,
  getProjectsByRating,
  getProjectsByDifficulty,
  getProjectsByArea,
  getProjectDescriptionById,
  projectAPI,
} from '../services/api';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
// Area map for mapping domain string to numeric ID
const areaMap: Record<string, number> = {
  'AI/ML': 1,
  'Web Development': 2,
  'IoT': 3,
  'Game Development': 4,
  'Android Development': 5,
};

const FilterPage: React.FC = () => {
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Get selected domain from navigation state
  const selectedDomain = location.state?.selectedDomain;

  useEffect(() => {
    if (selectedDomain) {
      setFilters((prev: FilterOptions) => ({ ...prev, area: areaMap[selectedDomain] }));
    }
  }, [selectedDomain]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [filters]);

  // Add this function to clear all favorites and reset favoriteIds
  const clearAllFavorites = () => {
    setFavoriteIds([]);
  };

  useEffect(() => {
    // Load favorites on mount
    const loadFavorites = async () => {
      const data = await projectAPI.getFavoriteProjects('1');
      setFavoriteIds(data.map((p: any) => p.pId || p.id));
    };
    loadFavorites();
    // Listen for localStorage changes (e.g., clear all)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'favorites_1') {
        loadFavorites();
      }
    };
    window.addEventListener('storage', onStorage);
    // Listen for custom event from FavoritesPage
    const onClearAll = () => clearAllFavorites();
    window.addEventListener('favorites:clearAll', onClearAll);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('favorites:clearAll', onClearAll);
    };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let data: Project[] = [];
      const { rating, difficulty, area } = filters;
      if (rating && difficulty && area) {
        data = await getProjectsByAll(rating, difficulty, area);
      } else if (rating && area) {
        data = await getProjectsByRatingArea(rating, area);
      } else if (difficulty && area) {
        data = await getProjectsByAreaDifficulty(difficulty, area);
      } else if (difficulty && rating) {
        data = await getProjectsByDifficultyRating(difficulty, rating);
      } else if (rating) {
        data = await getProjectsByRating(rating);
      } else if (difficulty) {
        data = await getProjectsByDifficulty(difficulty);
      } else if (area) {
        data = await getProjectsByArea(area);
      } else {
        data = await getProjectsByAll();
      }
      setProjects(data);
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
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

  const handleFavoriteToggle = async (project: Project) => {
    setFavoriteIds(prev =>
      prev.includes(project.pId)
        ? prev.filter(id => id !== project.pId)
        : [...prev, project.pId]
    );
    await projectAPI.toggleFavorite(project, '1');
    // No reload from localStorage here to avoid overwriting the optimistic state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          {loading ? (
            <div className="text-center py-12 text-lg text-gray-600">Loading projects...</div>
          ) : projects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters</p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.pId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={handleProjectClick}
                    isFavorite={favoriteIds.includes(project.pId)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </motion.div>
              ))}
            </div>
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

export default FilterPage; 