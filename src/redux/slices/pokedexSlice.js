import { createSlice } from '@reduxjs/toolkit';
import { BADGES } from '../data/badges';

const initialState = {
  captured: [],
  badgeCount: 0,
};

const pokedexSlice = createSlice({
  name: 'pokedex',
  initialState,
  reducers: {
    capturePokemon(state, action) {
      const newCard = action.payload;
      if (!state.captured.some((card) => card.name === newCard.name)) {
        state.captured.push(newCard);

        // Recalcul des badges débloqués
        const capturedCount = state.captured.length;
        const newBadgeCount = BADGES.filter(b => capturedCount >= b.threshold).length;
        state.badgeCount = newBadgeCount;
      }
    },
    resetPokedex() {
      return initialState;
    },
  },
});

export const { capturePokemon, resetPokedex } = pokedexSlice.actions;
export const selectCaptured = (state) => state.pokedex.captured;
export const selectBadgeCount = (state) => state.pokedex.badgeCount;

export default pokedexSlice.reducer;