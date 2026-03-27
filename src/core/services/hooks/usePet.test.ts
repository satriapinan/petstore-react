import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockEnqueueSnackbar = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockUseQuery = vi.fn();
const mockUseMutation = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
  useQuery: (opts: { queryKey: unknown; queryFn: unknown; enabled?: boolean }) =>
    mockUseQuery(opts),
  useMutation: (opts: { mutationFn: unknown; onSuccess?: () => void }) => mockUseMutation(opts),
}));

vi.mock('@core/services/api/pet.api', () => ({
  getPetsApi: vi.fn(),
  getPetByIdApi: vi.fn(),
  getPetInventoryApi: vi.fn(),
  createPetApi: vi.fn(),
  updatePetApi: vi.fn(),
  deletePetApi: vi.fn(),
}));

describe('usePet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: null });
    mockUseMutation.mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false });
  });

  it('returns default empty pets array when no data', async () => {
    const { usePet } = await import('./usePet');
    const { result } = renderHook(() => usePet());
    expect(result.current.pets).toEqual([]);
  });

  it('returns pets from query data', async () => {
    const pets = [{ id: 1, name: 'Dog' }];
    mockUseQuery.mockReturnValueOnce({ data: pets, isLoading: false, error: null });
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: null });
    const { usePet } = await import('./usePet');
    const { result } = renderHook(() => usePet('available'));
    expect(result.current.pets).toEqual(pets);
  });

  it('returns petsLoading true when loading', async () => {
    mockUseQuery.mockReturnValueOnce({ data: undefined, isLoading: true, error: null });
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: null });
    const { usePet } = await import('./usePet');
    const { result } = renderHook(() => usePet());
    expect(result.current.petsLoading).toBe(true);
  });

  it('calls createPet mutateAsync', async () => {
    const pet = { id: 1, name: 'Cat' };
    mockMutateAsync.mockResolvedValue(pet);
    const { usePet } = await import('./usePet');
    const { result } = renderHook(() => usePet());
    await act(async () => {
      await result.current.createPet(pet as never);
    });
    expect(mockMutateAsync).toHaveBeenCalledWith(pet);
  });

  it('calls updatePet mutateAsync', async () => {
    const pet = { id: 1, name: 'Bird' };
    mockMutateAsync.mockResolvedValue(pet);
    const { usePet } = await import('./usePet');
    const { result } = renderHook(() => usePet());
    await act(async () => {
      await result.current.updatePet(pet as never);
    });
    expect(mockMutateAsync).toHaveBeenCalledWith(pet);
  });

  it('calls deletePet mutateAsync', async () => {
    mockMutateAsync.mockResolvedValue(undefined);
    const { usePet } = await import('./usePet');
    const { result } = renderHook(() => usePet());
    await act(async () => {
      await result.current.deletePet(1);
    });
    expect(mockMutateAsync).toHaveBeenCalledWith(1);
  });

  it('onSuccess for createMutation invalidates queries and shows snackbar', async () => {
    const { usePet } = await import('./usePet');
    renderHook(() => usePet());
    const createCall = mockUseMutation.mock.calls[0]?.[0];
    await act(async () => {
      await createCall?.onSuccess?.();
    });
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Pet created successfully', {
      variant: 'success',
    });
  });

  it('onSuccess for updateMutation invalidates queries and shows snackbar', async () => {
    const { usePet } = await import('./usePet');
    renderHook(() => usePet());
    const updateCall = mockUseMutation.mock.calls[1]?.[0];
    await act(async () => {
      await updateCall?.onSuccess?.();
    });
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Pet updated successfully', {
      variant: 'success',
    });
  });

  it('onSuccess for deleteMutation invalidates queries', async () => {
    const { usePet } = await import('./usePet');
    renderHook(() => usePet());
    const deleteCall = mockUseMutation.mock.calls[2]?.[0];
    await act(async () => {
      await deleteCall?.onSuccess?.();
    });
    expect(mockInvalidateQueries).toHaveBeenCalled();
  });
});
