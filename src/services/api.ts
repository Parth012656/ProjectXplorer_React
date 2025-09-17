import axios from 'axios';
import { Project, LoginRequest, LoginResponse } from '../types';

// Base API configuration
const BASE_URL = 'http://localhost:8080/projectFilter'; // TODO: move to env
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Auth API configuration
const authApi = axios.create({
  baseURL: 'http://localhost:8080/api', // Auth endpoints base URL
  timeout: 10000,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

// Dummy data for admin panel
const dummyUsers = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', lastLogin: '2024-06-01 10:00' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', lastLogin: '2024-06-02 14:30' },
  { id: 3, name: 'Carol Lee', email: 'carol@example.com', role: 'Moderator', lastLogin: '2024-06-03 09:15' },
];
const dummyProjects = [
  { id: 1, title: 'AI Chatbot', domain: 'AI', difficulty: 'Medium', rating: 5 },
  { id: 2, title: 'Web Portfolio', domain: 'Web', difficulty: 'Easy', rating: 4 },
  { id: 3, title: 'IoT Home Automation', domain: 'IoT', difficulty: 'Hard', rating: 5 },
  { id: 4, title: 'ML Stock Predictor', domain: 'ML', difficulty: 'Medium', rating: 3 },
  { id: 5, title: 'Game Engine', domain: 'Game', difficulty: 'Hard', rating: 4 },
];
const dummyDomainCounts = [
  { domain: 'AI', count: 250 },
  { domain: 'Web', count: 250 },
  { domain: 'IoT', count: 250 },
  { domain: 'ML', count: 250 },
  { domain: 'Game', count: 250 },
];

export async function getUserCount() {
  return { count: dummyUsers.length };
}

export async function getProjectCount() {
  return { count: dummyProjects.length };
}

export async function getProjectsDomainCounts() {
  return dummyDomainCounts;
}

export async function getProjects() {
  return dummyProjects;
}

export async function addProject(data: any) {
  // Just simulate success
  return { success: true };
}

export async function getUsers() {
  return dummyUsers;
}

// Authentication API functions
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await authApi.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  },

  getStoredUser: () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (token && username && role) {
      return {
        token,
        username,
        role,
        isAuthenticated: true
      };
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

// Admin API configuration - separate instance for admin endpoints
const adminApi = axios.create({
  baseURL: 'http://localhost:8080/api', // Admin endpoints base URL
  timeout: 10000,
});

// Debug function to test admin API configuration
export const testAdminApi = async () => {
  const token = localStorage.getItem('token');
  console.log('Admin API Base URL:', adminApi.defaults.baseURL);
  console.log('JWT Token:', token ? 'Present' : 'Missing');
  console.log('Token Preview:', token ? token.substring(0, 20) + '...' : 'No token');
  
  // Test a simple request to see the actual URL being called
  try {
    const response = await adminApi.get('/admin/stats/users-count');
    console.log('Test API call successful:', response);
    return response;
  } catch (error: any) {
    console.error('Test API call failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url
    });
    throw error;
  }
};

// Add request interceptor to include JWT token for admin API
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration for admin API
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
// Admin API functions
export const adminAPI = {
  // Dashboard Stats
  getUsersCount: async (): Promise<{ count: number }> => {
    const response = await adminApi.get('/admin/stats/users-count');
    return response.data;
  },

  getProjectsCount: async (): Promise<{ count: number }> => {
    const response = await adminApi.get('/admin/stats/projects-count');
    return response.data;
  },

  getProjectsByDomain: async (): Promise<Array<{ domain: string; count: number }>> => {
    const response = await adminApi.get('/admin/stats/projects-by-domain');
    return response.data;
  },

  // Users Management
  getUsers: async (): Promise<Array<{
    username: string;
    email: string;
    role: string;
  }>> => {
    const response = await adminApi.get('/admin/users');
    return response.data;
  },

  // Projects Management
  getProjects: async (): Promise<Array<{
    pId: number;
    pName: string;
    domain: string;
    diffLevel: number;
    rating: number;
    briefDes: string;
    description: {
      desIid: number;
      wDescription: string;
      bestTech: string;
      softReq: string;
      hardReq: string;
    };
  }>> => {
    const response = await adminApi.get('/admin/projects');
    return response.data;
  },

  // Add Project -> must send payload matching backend
  addProject: async (projectData: {
    pName: string;
    briefDes: string;
    domain: string;
    diffLevel: number;
    rating: number;
    description: {
      wDescription: string;
      bestTech: string;
      softReq: string;
      hardReq: string;
    };
  }): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.post('/admin/projects', projectData);
    return response.data;
  },

  deleteProject: async (pId: number): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.delete(`/admin/projects/${pId}`);
    return response.data;
  },
  updateProject: async (pId: number, projectData: {
    pName: string;
    briefDes: string;
    domain: string;
    diffLevel: number;
    rating: number;
    areaId: number;
    description: {
      desIid?: number;
      wDescription: string;
      bestTech: string;
      softReq: string;
      hardReq: string;
    };
  }): Promise<{
    pId: number;
    pName: string;
    briefDes: string;
    domain: string;
    diffLevel: number;
    rating: number;
    areaId: number;
    description: {
      desIid: number;
      wDescription: string;
      bestTech: string;
      softReq: string;
      hardReq: string;
    };
  }> => {
    const response = await adminApi.put(`/admin/projects/${pId}`, projectData);
    return response.data;
  }  
  
};


// Leave space for baseURL config
// export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/projectFilter'; 