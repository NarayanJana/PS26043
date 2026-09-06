import { createSlice } from '@reduxjs/toolkit';

const savedFontSize = localStorage.getItem('a11yFontSize');
const savedReduceMotion = localStorage.getItem('a11yReduceMotion');
const savedHighContrast = localStorage.getItem('a11yHighContrast');

// Device-level preferences, same precedent as theme/language — persist
// across logout/login on this browser rather than being tied to the account.
const initialState = {
  fontSize: savedFontSize || 'medium',
  reduceMotion: savedReduceMotion === 'true',
  highContrast: savedHighContrast === 'true',
};

const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem('a11yFontSize', action.payload);
    },
    setReduceMotion: (state, action) => {
      state.reduceMotion = action.payload;
      localStorage.setItem('a11yReduceMotion', String(action.payload));
    },
    setHighContrast: (state, action) => {
      state.highContrast = action.payload;
      localStorage.setItem('a11yHighContrast', String(action.payload));
    },
  },
});

export const { setFontSize, setReduceMotion, setHighContrast } = accessibilitySlice.actions;
export default accessibilitySlice.reducer;