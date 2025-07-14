import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { FilterOptions } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const areaMap: Record<string, number> = {
  'AI/ML': 1,
  'IoT': 2,
  'Web Development': 3,
  'Game Development': 4,
  'Android Development': 5,
};
const areaReverseMap: Record<number, string> = Object.fromEntries(
  Object.entries(areaMap).map(([k, v]) => [v, k])
);
const domains = Object.keys(areaMap);
const difficulties = [1, 2, 3];
const ratings = [3, 4, 5];
const DIFFICULTY_MAP: Record<number, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Projects</h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <FaTimes />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Domain Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
          <select
            value={typeof filters.area === 'number' && filters.area in areaReverseMap ? areaReverseMap[filters.area] : ''}
            onChange={e => {
              const val = e.target.value;
              handleFilterChange('area' as keyof FilterOptions, val ? areaMap[val] : undefined);
            }}
            className="input-field"
          >
            <option value="">All Domains</option>
            {domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
          <select
            value={filters.rating || ''}
            onChange={e => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          >
            <option value="">Any Rating</option>
            {ratings.map(rating => (
              <option key={rating} value={rating}>{rating}+ Stars</option>
            ))}
          </select>
        </div>
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
          <select
            value={filters.difficulty || ''}
            onChange={e => handleFilterChange('difficulty' as keyof FilterOptions, e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          >
            <option value="">All Levels</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{DIFFICULTY_MAP[difficulty]}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="flex flex-wrap gap-2">
            {typeof filters.area === 'number' && filters.area in areaReverseMap && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Domain: {areaReverseMap[filters.area]}</span>
            )}
            {filters.rating && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Rating: {filters.rating}+</span>
            )}
            {typeof filters.difficulty === 'number' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Difficulty: {DIFFICULTY_MAP[filters.difficulty]}</span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterPanel; 