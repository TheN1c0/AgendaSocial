import type { User } from '../types/user.types';
import { apiClient } from './apiClient';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    // Ejemplo funcional para probar la integración con React Query
    return apiClient.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
};
