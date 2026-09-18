import { createSlice } from '@reduxjs/toolkit';

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getLanguageKey = () => {
  const user = getCurrentUser();

  if (!user) {
    return 'appLanguage_guest';
  }

  const userId = user._id || user.id || user.email;

  return `appLanguage_${userId}`;
};

const getSavedLanguage = () => {
  return localStorage.getItem(getLanguageKey()) || 'en';
};

const initialState = {
  language: getSavedLanguage(),
};

const languageSlice = createSlice({
  name: 'language',

  initialState,

  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;

      const key = getLanguageKey();
      localStorage.setItem(key, action.payload);
    },

    resetLanguage: (state) => {
      state.language = 'en';
    },
  },
});

export const { setLanguage, resetLanguage } = languageSlice.actions;

export default languageSlice.reducer;