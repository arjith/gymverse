import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import exerciseReducer from './exerciseSlice';
import cardioReducer from './cardioSlice';
import routineReducer from './routineSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exerciseReducer,
    cardio: cardioReducer,
    routines: routineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
