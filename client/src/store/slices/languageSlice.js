import { createSlice } from '@reduxjs/toolkit';

const savedLanguage = localStorage.getItem('appLanguage');

// Same pattern as themeSlice — a device-level preference, not tied to
// the logged-in account, so it survives logout/login on this browser.
const initialState = {
  language: savedLanguage || 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('appLanguage', action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;