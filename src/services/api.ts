import axios from 'axios';
import { Project } from '../types';

// Base API configuration
const BASE_URL = 'http://localhost:8080/projectFilter'; // TODO: move to env
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Project-related API calls
export const getProjectsByAll = async (rating?: number, difficulty?: number, area?: number): Promise<Project[]> => {
  const params: any = {};
  if (rating !== undefined) params.rating = rating;
  if (difficulty !== undefined) params.difficulty = difficulty;
  if (area) params.area = area;
  const { data } = await api.get('/search', { params });
  return data;
};

export const getProjectsByRatingArea = async (rating?: number, area?: number): Promise<Project[]> => {
  const params: any = {};
  if (rating !== undefined) params.rating = rating;
  if (area) params.area = area;
  const { data } = await api.get('/searchRA', { params });
  return data;
};

export const getProjectsByAreaDifficulty = async (difficulty?: number, area?: number): Promise<Project[]> => {
  const params: any = {};
  if (difficulty !== undefined) params.difficulty = difficulty;
  if (area) params.area = area;
  const { data } = await api.get('/searchAD', { params });
  return data;
};

export const getProjectsByDifficultyRating = async (difficulty?: number, rating?: number): Promise<Project[]> => {
  const params: any = {};
  if (difficulty !== undefined) params.difficulty = difficulty;
  if (rating !== undefined) params.rating = rating;
  const { data } = await api.get('/searchDR', { params });
  return data;
};

export const getProjectsByRating = async (rating?: number): Promise<Project[]> => {
  const params: any = {};
  if (rating !== undefined) params.rating = rating;
  const { data } = await api.get('/searchR', { params });
  return data;
};

export const getProjectsByDifficulty = async (difficulty?: number): Promise<Project[]> => {
  const params: any = {};
  if (difficulty !== undefined) params.difficulty = difficulty;
  const { data } = await api.get('/searchD', { params });
  return data;
};

export const getProjectsByArea = async (area?: number): Promise<Project[]> => {
  const params: any = {};
  if (area) params.area = area;
  const { data } = await api.get('/searchA', { params });
  return data;
};

export const getProjectDescriptionById = async (DescriptionId: number) => {
  const { data } = await api.get(`/descriptionID`, { params: { DescriptionId } });
  return data;
};

export const projectAPI = {
  getProjectsByAll,
  getProjectsByRatingArea,
  getProjectsByAreaDifficulty,
  getProjectsByDifficultyRating,
  getProjectsByRating,
  getProjectsByDifficulty,
  getProjectsByArea,
  getProjectDescriptionById,
  // Add stubs for favorites for now
  getFavoriteProjects: async (userId: string) => [],
  toggleFavorite: async (projectId: string, userId: string) => {},
};

// Leave space for baseURL config
// export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/projectFilter'; 