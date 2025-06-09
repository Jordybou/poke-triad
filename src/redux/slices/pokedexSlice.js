import { createSlice } from '@reduxjs/toolkit';
import { BADGES } from '../../utils/badges';

const initialState = {
  captured: [],
  all: [], // ← Ajouté : contient les 151 Pokémon chargés
  badgeCount: 0,
};

const pokedexSlice = createSlice({
  name: 'pokedex',
  initialState,
  reducers: {
    capturePokemon(state, action) {
      const newCard = action.payload;
      if (!state.captured.some((card) => card.id === newCard.id)) {
        state.captured.push(newCard);

        const capturedCount = state.captured.length;
        const newBadgeCount = BADGES.filter(b => capturedCount >= b.threshold).length;
        state.badgeCount = newBadgeCount;
      }
    },
    setAllPokemon(state, action) {
      state.all = action.payload; // ← Stockage du Pokédex complet
    },
    resetPokedex() {
      return initialState;
    },
  },
});

export const {
  capturePokemon,
  setAllPokemon,
  resetPokedex,
} = pokedexSlice.actions;

export const selectCaptured = (state) => state.pokedex.captured;
export const selectAllPokemon = (state) => state.pokedex.all;
export const selectBadgeCount = (state) => state.pokedex.badgeCount;

export default pokedexSlice.reducer;