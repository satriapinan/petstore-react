import { api } from '@/core/interceptors/axios';
import { API } from '@shared/constants/api.constants';
import type { Pet } from '@shared/models/pet.model';

export const getPetInventoryApi = async (): Promise<Record<string, number>> => {
  const res = await api.get<Record<string, number>>(API.STORE.INVENTORY);
  return res.data;
};

export const getPetsApi = async (status: string): Promise<Pet[]> => {
  const res = await api.get<Pet[]>(API.PET.FIND_BY_STATUS, {
    params: { status },
  });
  return res.data;
};

export const getPetByIdApi = async (id: number): Promise<Pet> => {
  const res = await api.get<Pet>(`${API.PET.GET}/${id}`);
  return res.data;
};

export const createPetApi = async (pet: Pet): Promise<Pet> => {
  const res = await api.post<Pet>(API.PET.CREATE, pet);
  return res.data;
};

export const updatePetApi = async (pet: Pet): Promise<Pet> => {
  const res = await api.put<Pet>(API.PET.UPDATE, pet);
  return res.data;
};

export const deletePetApi = async (id: number): Promise<void> => {
  await api.delete(`${API.PET.DELETE}/${id}`);
};
