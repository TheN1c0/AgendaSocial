import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tiposCasoService } from '../services/tiposCasoService';

export function useTiposCaso() {
  const queryClient = useQueryClient();

  const { data: tiposCaso = [], isLoading, error } = useQuery({
    queryKey: ['tipos-caso'],
    queryFn: tiposCasoService.getTiposCaso,
  });

  const createMutation = useMutation({
    mutationFn: tiposCasoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-caso'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { nombre: string } }) => tiposCasoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-caso'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: tiposCasoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-caso'] });
    }
  });

  return {
    tiposCaso,
    isLoading,
    error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
