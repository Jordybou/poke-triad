import { createSlice } from '@reduxjs/toolkit';

// Liste complète des règles disponibles
const allRules = [
  'Ordre',
  'Elémentaire',
  'Open',
  'Combo',
  'Plus',
  'Identique',
  'Mur',
  'Chaos',
];

const initialState = {
  unlockedRules: [],   // Règles débloquées via les badges
  activeRules: [],     // Règles actuellement activées par le joueur
};

const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    // Débloque une règle (et l’active automatiquement)
    unlockRule(state, action) {
      const rule = action.payload;
      if (!state.unlockedRules.includes(rule)) {
        state.unlockedRules.push(rule);
        state.activeRules.push(rule); // activée par défaut
      }
    },

    // Active/désactive une règle (si elle est débloquée)
    toggleRule(state, action) {
      const rule = action.payload;

      if (!state.unlockedRules.includes(rule)) return; // sécurité

      if (state.activeRules.includes(rule)) {
        state.activeRules = state.activeRules.filter(r => r !== rule);
      } else {
        state.activeRules.push(rule);
      }
    },

    // Réactive toutes les règles débloquées
    resetRules(state) {
      state.activeRules = [...state.unlockedRules];
    },
  },
});

// Actions exportées
export const { unlockRule, toggleRule, resetRules } = rulesSlice.actions;

// Sélecteurs
export const selectUnlockedRules = (state) => state.rules.unlockedRules;
export const selectActiveRules = (state) => state.rules.activeRules;

// Fonction utilitaire pour accéder à la liste complète des règles
export const getAllRules = () => allRules;

export default rulesSlice.reducer;