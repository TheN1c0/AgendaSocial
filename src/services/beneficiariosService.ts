import { apiClient } from './apiClient';

export interface Beneficiario {
  id: string;
  nombre: string;
  rut: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fechaNacimiento?: string;
  grupoFamiliar?: string;
  createdAt: string;
  _count?: { casos: number };
}

export const beneficiariosService = {
  getBeneficiarios: async (q?: string): Promise<Beneficiario[]> => {
    const searchParams = new URLSearchParams();
    if (q) searchParams.append('q', q);
    return apiClient.get<Beneficiario[]>(`/beneficiarios?${searchParams.toString()}`);
  },

  getBeneficiarioById: async (id: string): Promise<any> => {
    return apiClient.get<any>(`/beneficiarios/${id}`);
  },

  createBeneficiario: async (data: Partial<Beneficiario>): Promise<Beneficiario> => {
    return apiClient.post<Beneficiario>('/beneficiarios', data);
  },

  updateBeneficiario: async (id: string, data: Partial<Beneficiario>): Promise<Beneficiario> => {
    return apiClient.put<Beneficiario>(`/beneficiarios/${id}`, data);
  },

  deleteBeneficiario: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/beneficiarios/${id}`);
  }
};
