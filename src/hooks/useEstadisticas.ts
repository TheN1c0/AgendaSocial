import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

interface CasosPorEstado {
  estado: string;
  cantidad: number;
}

interface CasosPorMes {
  mes: string;
  casos: number;
}

interface CasosPorTipo {
  tipo: string;
  cantidad: number;
}

const FIVE_MINUTES = 1000 * 60 * 5;

const fetchCasosPorEstado = async (): Promise<CasosPorEstado[]> => {
  return apiClient.get('/estadisticas/casos-por-estado');
};

const fetchCasosPorMes = async (): Promise<CasosPorMes[]> => {
  return apiClient.get('/estadisticas/casos-por-mes');
};

const fetchCasosPorTipo = async (): Promise<CasosPorTipo[]> => {
  return apiClient.get('/estadisticas/casos-por-tipo');
};

export const useCasosPorEstado = () => {
  return useQuery({
    queryKey: ['estadisticas', 'por-estado'],
    queryFn: fetchCasosPorEstado,
    staleTime: FIVE_MINUTES,
  });
};

export const useCasosPorMes = () => {
  return useQuery({
    queryKey: ['estadisticas', 'por-mes'],
    queryFn: fetchCasosPorMes,
    staleTime: FIVE_MINUTES,
  });
};

export const useCasosPorTipo = () => {
  return useQuery({
    queryKey: ['estadisticas', 'por-tipo'],
    queryFn: fetchCasosPorTipo,
    staleTime: FIVE_MINUTES,
  });
};
