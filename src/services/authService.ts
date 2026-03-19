import { apiClient } from './apiClient';
import type { User } from '../types/user.types';

export interface AuthResponse {
  token: string;
  usuario: User;
}

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },
  
  getMe: async (): Promise<{ usuario: User }> => {
    return apiClient.get<{ usuario: User }>('/auth/me');
  },

  changePassword: async (data: any): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/auth/password', data);
  }
};
