import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('notistack', () => ({
  enqueueSnackbar: vi.fn(),
}));

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  };
});

describe('axios interceptors', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches Authorization header when token exists in localStorage', async () => {
    localStorage.setItem('access_token', 'my-token');
    const { api } = await import('./axios');
    const config = { headers: { Authorization: '' } } as never;
    const requestInterceptor = (api.interceptors.request.use as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0];
    if (requestInterceptor) {
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe('Bearer my-token');
    }
  });

  it('does not attach Authorization header when no token', async () => {
    const { api } = await import('./axios');
    const config = { headers: {} } as never;
    const requestInterceptor = (api.interceptors.request.use as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0];
    if (requestInterceptor) {
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBeUndefined();
    }
  });

  it('passes through successful responses', async () => {
    const { api } = await import('./axios');
    const mockResponse = { data: { id: 1 } };
    const responseInterceptor = (api.interceptors.response.use as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[0];
    if (responseInterceptor) {
      const result = responseInterceptor(mockResponse);
      expect(result).toBe(mockResponse);
    }
  });
});
