import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/core/interceptors/axios', () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    put: (...args: unknown[]) => mockPut(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

vi.mock('@shared/constants/api.constants', () => ({
  API: {
    STORE: { INVENTORY: '/store/inventory' },
    PET: {
      FIND_BY_STATUS: '/pet/findByStatus',
      GET: '/pet',
      CREATE: '/pet',
      UPDATE: '/pet',
      DELETE: '/pet',
    },
  },
}));

describe('pet.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getPetInventoryApi returns inventory data', async () => {
    mockGet.mockResolvedValue({ data: { available: 5, pending: 2, sold: 1 } });
    const { getPetInventoryApi } = await import('./pet.api');
    const result = await getPetInventoryApi();
    expect(result).toEqual({ available: 5, pending: 2, sold: 1 });
    expect(mockGet).toHaveBeenCalledWith('/store/inventory');
  });

  it('getPetsApi returns list of pets', async () => {
    const pets = [{ id: 1, name: 'Dog' }];
    mockGet.mockResolvedValue({ data: pets });
    const { getPetsApi } = await import('./pet.api');
    const result = await getPetsApi('available');
    expect(result).toEqual(pets);
    expect(mockGet).toHaveBeenCalledWith('/pet/findByStatus', { params: { status: 'available' } });
  });

  it('getPetByIdApi returns single pet', async () => {
    const pet = { id: 1, name: 'Cat' };
    mockGet.mockResolvedValue({ data: pet });
    const { getPetByIdApi } = await import('./pet.api');
    const result = await getPetByIdApi(1);
    expect(result).toEqual(pet);
    expect(mockGet).toHaveBeenCalledWith('/pet/1');
  });

  it('createPetApi returns created pet', async () => {
    const pet = { id: 1, name: 'Bird' };
    mockPost.mockResolvedValue({ data: pet });
    const { createPetApi } = await import('./pet.api');
    const result = await createPetApi(pet as never);
    expect(result).toEqual(pet);
    expect(mockPost).toHaveBeenCalledWith('/pet', pet);
  });

  it('updatePetApi returns updated pet', async () => {
    const pet = { id: 1, name: 'Fish' };
    mockPut.mockResolvedValue({ data: pet });
    const { updatePetApi } = await import('./pet.api');
    const result = await updatePetApi(pet as never);
    expect(result).toEqual(pet);
    expect(mockPut).toHaveBeenCalledWith('/pet', pet);
  });

  it('deletePetApi calls delete endpoint', async () => {
    mockDelete.mockResolvedValue({});
    const { deletePetApi } = await import('./pet.api');
    await deletePetApi(1);
    expect(mockDelete).toHaveBeenCalledWith('/pet/1');
  });
});
