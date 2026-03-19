import type { User } from '../types/user.types';
import { apiClient } from './apiClient';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/usuarios');
  }
};
