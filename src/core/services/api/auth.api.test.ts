import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock('@/core/interceptors/axios', () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

vi.mock('@shared/constants/api.constants', () => ({
  API: {
    USER: {
      LOGIN: '/user/login',
      GET: '/user',
      CREATE: '/user',
    },
  },
}));

describe('auth.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loginApi returns token string', async () => {
    mockGet.mockResolvedValue({ data: 'fake-token' });
    const { loginApi } = await import('./auth.api');
    const result = await loginApi('admin', 'password');
    expect(result).toBe('fake-token');
    expect(mockGet).toHaveBeenCalledWith('/user/login', {
      params: { username: 'admin', password: 'password' },
    });
  });

  it('getUserApi returns user object', async () => {
    const user = { id: 1, username: 'admin' };
    mockGet.mockResolvedValue({ data: user });
    const { getUserApi } = await import('./auth.api');
    const result = await getUserApi('admin');
    expect(result).toEqual(user);
    expect(mockGet).toHaveBeenCalledWith('/user/admin');
  });

  it('registerApi returns created user', async () => {
    const user = { id: 1, username: 'john' };
    mockPost.mockResolvedValue({ data: user });
    const { registerApi } = await import('./auth.api');
    const result = await registerApi(user as never);
    expect(result).toEqual(user);
    expect(mockPost).toHaveBeenCalledWith('/user', user);
  });
});
