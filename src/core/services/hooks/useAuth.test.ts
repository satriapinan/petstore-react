import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
const mockEnqueueSnackbar = vi.fn();
const mockMutateAsync = vi.fn();
const mockUseMutation = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('notistack', () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: {
    mutationFn: unknown;
    onSuccess?: (data: unknown) => void;
    onError?: () => void;
  }) => mockUseMutation(opts),
}));

vi.mock('@core/services/api/auth.api', () => ({
  loginApi: vi.fn(),
  getUserApi: vi.fn(),
  registerApi: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });
  });

  it('returns isAuthenticated false when no token', async () => {
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated true when token exists', async () => {
    localStorage.setItem('token', 'fake-token');
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns user from localStorage', async () => {
    const user = { username: 'admin' };
    localStorage.setItem('user', JSON.stringify(user));
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(user);
  });

  it('logout clears localStorage and navigates to /login', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'admin' }));
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.logout();
    });
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Logout successful', { variant: 'success' });
  });

  it('login calls mutateAsync and navigates for admin', async () => {
    const user = { username: 'admin' };
    mockMutateAsync.mockResolvedValue(user);
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login({ username: 'admin', password: 'pass' });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('login navigates to /pets for non-admin user', async () => {
    const user = { username: 'john' };
    mockMutateAsync.mockResolvedValue(user);
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login({ username: 'john', password: 'pass' });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/pets');
  });

  it('register calls mutateAsync and navigates to /login', async () => {
    const user = { username: 'newuser' };
    mockMutateAsync.mockResolvedValue(user);
    const { useAuth } = await import('./useAuth');
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.register(user as never);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
