import api from './api';
import { GenerateRoutineRequest, RoutineResponse, RoutinesListResponse } from '../types';

export const routineService = {
  generate: async (request: GenerateRoutineRequest) => {
    const { data } = await api.post<RoutineResponse>('/routines/generate', request);
    return data;
  },

  preview: async (request: GenerateRoutineRequest) => {
    const { data } = await api.post<RoutineResponse>('/routines/preview', request);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get<RoutinesListResponse>('/routines');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<RoutineResponse>(`/routines/${id}`);
    return data;
  },

  update: async (id: string, updates: Record<string, unknown>) => {
    const { data } = await api.put<RoutineResponse>(`/routines/${id}`, updates);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/routines/${id}`);
  },
};
