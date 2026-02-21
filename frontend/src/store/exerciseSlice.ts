import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from '../types';
import { exerciseService } from '../services/exerciseService';

interface ExerciseState {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  alternates: Exercise[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: {
    muscleGroup: string;
    equipment: string;
    difficulty: string;
    search: string;
  };
}

const initialState: ExerciseState = {
  exercises: [],
  selectedExercise: null,
  alternates: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    muscleGroup: '',
    equipment: '',
    difficulty: '',
    search: '',
  },
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetchAll',
  async (filters?: Record<string, string>) => {
    const data = await exerciseService.getAll(filters);
    return data;
  }
);

export const fetchExerciseDetail = createAsyncThunk(
  'exercises/fetchDetail',
  async (id: string) => {
    const data = await exerciseService.getById(id);
    return data;
  }
);

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ExerciseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelection: (state) => {
      state.selectedExercise = null;
      state.alternates = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload.exercises;
        state.total = action.payload.total;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch exercises';
      })
      .addCase(fetchExerciseDetail.fulfilled, (state, action) => {
        state.selectedExercise = action.payload.exercise;
        state.alternates = action.payload.alternates;
      });
  },
});

export const { setFilters, clearSelection } = exerciseSlice.actions;
export default exerciseSlice.reducer;
