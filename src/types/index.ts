export interface Project {
  id: number;
  pId: number;
  pName: string;
  briefDes: string;
  diffLevel: number;
  rating: number;
  domain: string;
  description: {
    desIid: number;
    wDescription: string;
    bestTech: string;
    softReq: string;
    hardReq: string;
  };
}

export type Domain = 'AI/ML' | 'Web Development' | 'IoT' | 'Game Development' | 'Android Development';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export interface FilterOptions {
  area?: number;
  rating?: number;
  difficulty?: number;
}

export interface AuthFormData {
  username: string;
  email: string;
  password: string;
} 