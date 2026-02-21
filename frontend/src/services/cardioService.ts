import api from './api';
import { CardioActivity, CardioListResponse } from '../types';

export const cardioService = {
  getAll: async (filters?: {
    category?: string;
    intensityLevel?: string;
    funRating?: string;
    tags?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
    }
    const { data } = await api.get<CardioListResponse>(`/cardio?${params}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ cardio: CardioActivity }>(`/cardio/${id}`);
    return data;
  },

  getRandom: async (filters?: {
    category?: string;
    intensityLevel?: string;
    tags?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
    }
    const { data } = await api.get<{ cardio: CardioActivity }>(`/cardio/random?${params}`);
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get<{ categories: string[] }>('/cardio/categories');
    return data;
  },
};
