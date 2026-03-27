import { getUserApi, loginApi, registerApi } from '@core/services/api/auth.api';
import type { User } from '@shared/models/user.model';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem('user');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => !!localStorage.getItem('token');

export const useAuth = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(getStoredUser);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      await loginApi(username, password);
      return await getUserApi(username);
    },

    onSuccess: (user) => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(user));

      enqueueSnackbar('Login successful!', { variant: 'success' });
    },

    onError: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: User) => registerApi(userData),

    onSuccess: () => {
      enqueueSnackbar('Registration successful!', {
        variant: 'success',
      });
    },
  });

  const login = async (payload: { username: string; password: string }) => {
    const user = await loginMutation.mutateAsync(payload);
    setUser(user);

    navigate(user.username === 'admin' ? '/dashboard' : '/pets');

    return user;
  };

  const register = async (payload: User) => {
    const result = await registerMutation.mutateAsync(payload);
    navigate('/login');
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    enqueueSnackbar('Logout successful', { variant: 'success' });
    navigate('/login');
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),

    login,
    register,
    logout,

    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,

    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
