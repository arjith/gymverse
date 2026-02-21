import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CardioActivity } from '../types';
import { cardioService } from '../services/cardioService';

interface CardioState {
  activities: CardioActivity[];
  selectedActivity: CardioActivity | null;
  surpriseActivity: CardioActivity | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    intensityLevel: string;
    funRating: string;
    search: string;
  };
}

const initialState: CardioState = {
  activities: [],
  selectedActivity: null,
  surpriseActivity: null,
  total: 0,
  loading: false,
  error: null,
  filters: {
    category: '',
    intensityLevel: '',
    funRating: '',
    search: '',
  },
};

export const fetchCardio = createAsyncThunk(
  'cardio/fetchAll',
  async (filters?: Record<string, string>) => {
    const data = await cardioService.getAll(filters);
    return data;
  }
);

export const fetchRandomCardio = createAsyncThunk(
  'cardio/fetchRandom',
  async (filters?: Record<string, string>) => {
    const data = await cardioService.getRandom(filters);
    return data.cardio;
  }
);

const cardioSlice = createSlice({
  name: 'cardio',
  initialState,
  reducers: {
    setCardioFilters: (state, action: PayloadAction<Partial<CardioState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedActivity: (state, action: PayloadAction<CardioActivity | null>) => {
      state.selectedActivity = action.payload;
    },
    clearSurprise: (state) => {
      state.surpriseActivity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardio.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCardio.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.cardio;
        state.total = action.payload.total;
      })
      .addCase(fetchCardio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cardio';
      })
      .addCase(fetchRandomCardio.fulfilled, (state, action) => {
        state.surpriseActivity = action.payload;
      });
  },
});

export const { setCardioFilters, setSelectedActivity, clearSurprise } = cardioSlice.actions;
export default cardioSlice.reducer;
