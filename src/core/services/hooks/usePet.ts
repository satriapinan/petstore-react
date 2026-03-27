import {
  createPetApi,
  deletePetApi,
  getPetByIdApi,
  getPetInventoryApi,
  getPetsApi,
  updatePetApi,
} from '@core/services/api/pet.api';
import type { PetInventory } from '@shared/models/inventory.model';
import type { Pet } from '@shared/models/pet.model';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

export const PET_KEYS = {
  all: ['pets'] as const,
  list: (status: string) => ['pets', 'list', status] as const,
  detail: (id: number) => ['pets', 'detail', id] as const,
  inventory: ['pets', 'inventory'] as const,
};

export const usePet = (status = 'available', id?: number) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const petsQuery = useQuery({
    queryKey: PET_KEYS.list(status),
    queryFn: () => getPetsApi(status),
  });

  const petDetailQuery = useQuery({
    queryKey: PET_KEYS.detail(id as number),
    queryFn: () => getPetByIdApi(id as number),
    enabled: !!id,
  });

  const inventoryQuery = useQuery({
    queryKey: PET_KEYS.inventory,
    queryFn: async (): Promise<PetInventory> => {
      const inv = await getPetInventoryApi();
      return {
        available: inv['available'] ?? 0,
        pending: inv['pending'] ?? 0,
        sold: inv['sold'] ?? 0,
      };
    },
  });

  const createMutation = useMutation({
    mutationFn: (pet: Pet) => createPetApi(pet),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PET_KEYS.all });
      enqueueSnackbar('Pet created successfully', { variant: 'success' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (pet: Pet) => updatePetApi(pet),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PET_KEYS.all });
      enqueueSnackbar('Pet updated successfully', { variant: 'success' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePetApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PET_KEYS.all });
    },
  });

  return {
    pets: petsQuery.data ?? [],
    petsLoading: petsQuery.isLoading,
    petsError: petsQuery.error,

    pet: petDetailQuery.data,
    petLoading: petDetailQuery.isLoading,
    petError: petDetailQuery.error,

    inventory: inventoryQuery.data,
    inventoryLoading: inventoryQuery.isLoading,
    inventoryError: inventoryQuery.error,

    createPet: createMutation.mutateAsync,
    updatePet: updateMutation.mutateAsync,
    deletePet: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
