import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { etiquetasService } from '../services/etiquetasService';

export const useEtiquetas = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['etiquetas'],
    queryFn: etiquetasService.getEtiquetas
  });

  const createMutation = useMutation({
    mutationFn: etiquetasService.createEtiqueta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etiquetas'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { nombre?: string; color?: string } }) => 
      etiquetasService.updateEtiqueta(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etiquetas'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: etiquetasService.deleteEtiqueta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etiquetas'] });
    }
  });

  return {
    etiquetas: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    delete: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  };
};
