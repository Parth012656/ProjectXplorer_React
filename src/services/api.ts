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
  // Favorites using localStorage
  getFavoriteProjects: async (userId: string) => {
    const favs = localStorage.getItem(`favorites_${userId}`);
    if (!favs) return [];
    try {
      return JSON.parse(favs);
    } catch {
      return [];
    }
  },
  toggleFavorite: async (project: any, userId: string) => {
    const key = `favorites_${userId}`;
    let favs = localStorage.getItem(key);
    let arr: any[] = [];
    if (favs) {
      try {
        arr = JSON.parse(favs);
      } catch {
        arr = [];
      }
    }
    // Remove if exists, else add (match by pId or id)
    const idx = arr.findIndex((p) => (p.pId !== undefined && project.pId !== undefined && p.pId === project.pId) || (p.id !== undefined && project.id !== undefined && p.id === project.id));
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(project);
    }
    localStorage.setItem(key, JSON.stringify(arr));
  },
};

// Leave space for baseURL config
// export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/projectFilter'; 