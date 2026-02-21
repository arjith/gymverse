import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Routine, GenerateRoutineRequest } from '../types';
import { routineService } from '../services/routineService';

interface RoutineState {
  routines: Routine[];
  currentRoutine: Routine | null;
  previewRoutine: Routine | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoutineState = {
  routines: [],
  currentRoutine: null,
  previewRoutine: null,
  loading: false,
  error: null,
};

export const generateRoutine = createAsyncThunk(
  'routines/generate',
  async (request: GenerateRoutineRequest, { rejectWithValue }) => {
    try {
      const data = await routineService.generate(request);
      return data.routine;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to generate routine');
    }
  }
);

export const previewRoutine = createAsyncThunk(
  'routines/preview',
  async (request: GenerateRoutineRequest) => {
    const data = await routineService.preview(request);
    return data.routine;
  }
);

export const fetchRoutines = createAsyncThunk('routines/fetchAll', async () => {
  const data = await routineService.getAll();
  return data.routines;
});

export const deleteRoutine = createAsyncThunk('routines/delete', async (id: string) => {
  await routineService.delete(id);
  return id;
});

const routineSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    clearPreview: (state) => {
      state.previewRoutine = null;
    },
    setCurrentRoutine: (state, action: PayloadAction<Routine | null>) => {
      state.currentRoutine = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoutine = action.payload;
        state.routines.push(action.payload);
      })
      .addCase(generateRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(previewRoutine.fulfilled, (state, action) => {
        state.previewRoutine = action.payload;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.routines = action.payload;
      })
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.routines = state.routines.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearPreview, setCurrentRoutine } = routineSlice.actions;
export default routineSlice.reducer;
