import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';

export const store = configureStore({
  devTools:true,
  reducer: {
    notes: notesReducer,
  },
});