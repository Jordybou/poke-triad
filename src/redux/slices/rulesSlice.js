import { createSlice } from '@reduxjs/toolkit';

const allRules = ['Ordre', 'Elémentaire', 'Open', 'Combo', 'Plus', 'Identique', 'Mur', 'Chaos'];

const initialState = {
  unlockedRules: [], // par exemple ['Ordre', 'Mur'] si 2 badges débloqués
  activeRules: [],   // les règles actuellement activées par le joueur
};

const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    unlockRule(state, action) {
      if (!state.unlockedRules.includes(action.payload)) {
        state.unlockedRules.push(action.payload);
        state.activeRules.push(action.payload); // activée par défaut
      }
    },
    toggleRule(state, action) {
      const rule = action.payload;
      if (state.activeRules.includes(rule)) {
        state.activeRules = state.activeRules.filter(r => r !== rule);
      } else if (state.unlockedRules.includes(rule)) {
        state.activeRules.push(rule);
      }
    },
    resetRules(state) {
      state.activeRules = [...state.unlockedRules];
    },
  },
});

export const { unlockRule, toggleRule, resetRules } = rulesSlice.actions;
export const selectUnlockedRules = (state) => state.rules.unlockedRules;
export const selectActiveRules = (state) => state.rules.activeRules;
export const getAllRules = () => allRules;
export default rulesSlice.reducer;