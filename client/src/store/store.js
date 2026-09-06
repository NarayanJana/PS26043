import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
import accessibilityReducer from './slices/accessibilitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    accessibility: accessibilityReducer,
  },
});