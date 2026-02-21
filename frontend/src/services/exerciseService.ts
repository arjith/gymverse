import api from './api';
import { ExercisesResponse, ExerciseDetailResponse } from '../types';

export const exerciseService = {
  getAll: async (filters?: {
    muscleGroup?: string;
    equipment?: string;
    difficulty?: string;
    search?: string;
    tags?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
    }
    const { data } = await api.get<ExercisesResponse>(`/exercises?${params}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ExerciseDetailResponse>(`/exercises/${id}`);
    return data;
  },

  getAlternates: async (id: string) => {
    const { data } = await api.get<{ alternates: ExerciseDetailResponse['alternates'] }>(
      `/exercises/${id}/alternates`
    );
    return data;
  },

  getMuscleGroups: async () => {
    const { data } = await api.get<{ muscleGroups: string[] }>('/exercises/muscle-groups');
    return data;
  },
};
