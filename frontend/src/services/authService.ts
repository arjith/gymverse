import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('gymverse_token', data.token);
    localStorage.setItem('gymverse_user', JSON.stringify(data.user));
    return data;
  },

  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    localStorage.setItem('gymverse_token', data.token);
    localStorage.setItem('gymverse_user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('gymverse_token');
    localStorage.removeItem('gymverse_user');
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('gymverse_user');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('gymverse_token');
  },

  getMe: async () => {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data;
  },
};
