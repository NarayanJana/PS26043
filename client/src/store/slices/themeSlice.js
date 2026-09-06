import { createSlice } from '@reduxjs/toolkit';

const savedMode = localStorage.getItem('themeMode');

// mode is the user's actual choice: 'light' | 'dark' | 'system'.
// Deliberately a plain localStorage key (not scoped to a user id), so
// it persists across logout/login on the same browser, same as most
// consumer apps treat theme as a device preference rather than
// per-account data.
const initialState = {
  mode: savedMode || 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;