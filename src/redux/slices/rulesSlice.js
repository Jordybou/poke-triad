import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enabledRules: [],
  unlockedRules: [
    'Combo',
    'Plus',
    'Identique',
    'Mur',
    'Ordre',
    'Aléatoire',
    'Élémental',
    'Open'
  ],
};

export const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    toggleRule: (state, action) => {
      const rule = action.payload;
      if (state.enabledRules.includes(rule)) {
        state.enabledRules = state.enabledRules.filter(r => r !== rule);
      } else {
        state.enabledRules.push(rule);
      }
    },
    resetRules: (state) => {
      state.enabledRules = [];
    }
  },
});

export const { toggleRule, resetRules } = rulesSlice.actions;
export const ALL_RULES = ['Mur', 'Combo', 'Identique', 'Plus', 'Open', 'Élémental', 'Ordre', 'Aléatoire'];
export default rulesSlice.reducer;