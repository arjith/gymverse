import api from './api';
import { AuthResponse, User } from '../types';

// Default dev user — auto-login for E2E testing
const DEFAULT_USER: User = {
  id: 'demo-user-1',
  email: 'demo@gymverse.com',
  name: 'Demo User',
  fitnessLevel: 'intermediate',
  preferredEquipment: ['barbell', 'dumbbell', 'bodyweight'],
  createdAt: new Date().toISOString(),
};
const DEV_TOKEN = 'dev-bypass-token';

// Ensure default user is always set in localStorage
if (!localStorage.getItem('gymverse_token')) {
  localStorage.setItem('gymverse_token', DEV_TOKEN);
  localStorage.setItem('gymverse_user', JSON.stringify(DEFAULT_USER));
}

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
    // Re-set default user instead of clearing (dev bypass)
    localStorage.setItem('gymverse_token', DEV_TOKEN);
    localStorage.setItem('gymverse_user', JSON.stringify(DEFAULT_USER));
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
