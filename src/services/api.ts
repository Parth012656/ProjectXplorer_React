// src/services/api.ts
import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  Project,
  AuthUser 
} from '../types';

/* =============================
   AUTHENTICATION API
   ============================= */

   const authAxios = axios.create({
    baseURL: 'http://localhost:8080/api/auth',
    headers: { 'Content-Type': 'application/json' },
  });
  
  export const authAPI = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      try {
        const response = await authAxios.post('/login', credentials);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },
  
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
      try {
        const response = await authAxios.post('/register', data);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 409) {
          throw {
            response: {
              status: 409,
              data: error.response?.data || { error: 'DUPLICATE' },
            },
          };
        }
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },
  
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      sessionStorage.clear();
      window.location.href = '/home'; // redirect after logout
    },
  
    getStoredUser: (): AuthUser | null => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      if (token && username && role) {
        return {
          token,
          username,
          role,
          isAuthenticated: true,
        } as AuthUser; // ✅ type-cast ensures no TS error
      }
      return null;
    },
  
    isAuthenticated: (): boolean => {
      return !!localStorage.getItem('token');
    },
  };

/* =============================
   PROJECT FILTER API
   ============================= */

const BASE_URL = 'http://localhost:8080/projectFilter'; // TODO: move to env
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor → inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authAPI.logout();
    }
    return Promise.reject(error);
  }
);

// Project search endpoints
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
  const { data } = await api.get('/searchR', { params: { rating } });
  return data;
};

export const getProjectsByDifficulty = async (difficulty?: number): Promise<Project[]> => {
  const { data } = await api.get('/searchD', { params: { difficulty } });
  return data;
};

export const getProjectsByArea = async (area?: number): Promise<Project[]> => {
  const { data } = await api.get('/searchA', { params: { area } });
  return data;
};

export const getProjectDescriptionById = async (DescriptionId: number) => {
  const { data } = await api.get(`/descriptionID`, { params: { DescriptionId } });
  return data;
};

// Favorites using localStorage
export const projectAPI = {
  getProjectsByAll,
  getProjectsByRatingArea,
  getProjectsByAreaDifficulty,
  getProjectsByDifficultyRating,
  getProjectsByRating,
  getProjectsByDifficulty,
  getProjectsByArea,
  getProjectDescriptionById,

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
    let arr: any[] = [];
    const favs = localStorage.getItem(key);
    if (favs) {
      try {
        arr = JSON.parse(favs);
      } catch {
        arr = [];
      }
    }
    const idx = arr.findIndex(
      (p) => 
        (p.pId !== undefined && project.pId !== undefined && p.pId === project.pId) ||
        (p.id !== undefined && project.id !== undefined && p.id === project.id)
    );
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(project);
    }
    localStorage.setItem(key, JSON.stringify(arr));
  },
};

/* =============================
   ADMIN API
   ============================= */

const adminApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Inject JWT for admin API
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout on 401
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authAPI.logout();
    }
    return Promise.reject(error);
  }
);

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
  }): Promise<any> => {
    const response = await adminApi.put(`/admin/projects/${pId}`, projectData);
    return response.data;
  }
};
