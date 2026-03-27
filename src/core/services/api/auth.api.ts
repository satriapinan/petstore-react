import { api } from '@/core/interceptors/axios';
import { API } from '@shared/constants/api.constants';
import type { User } from '@shared/models/user.model';

export const loginApi = async (username: string, password: string): Promise<string> => {
  const res = await api.get<string>(API.USER.LOGIN, {
    params: { username, password },
  });
  return res.data;
};

export const getUserApi = async (username: string): Promise<User> => {
  const res = await api.get<User>(`${API.USER.GET}/${username}`);
  return res.data;
};

export const registerApi = async (user: User): Promise<User> => {
  const res = await api.post<User>(API.USER.CREATE, user);
  return res.data;
};
