import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  captured: [],       // les cartes attrapées
  all: [],            // tous les pokémons de la 1ʳᵉ gen
  progression: 0,     // ex: 0.32 pour 32%
  badges: []          // ["Badge 1", "Badge 2", ...]
};

const pokedexSlice = createSlice({
  name: 'pokedex',
  initialState,
  reducers: {
    addToPokedex: (state, action) => {
      const exists = state.captured.some(card => card.name === action.payload.name);
      if (!exists) {
        state.captured.push(action.payload);
        state.progression = state.captured.length / 151;

        const totalBadges = 8;
        const needed = Math.floor(state.progression * totalBadges);
        const current = state.badges.length;
        for (let i = current + 1; i <= needed; i++) {
          state.badges.push(`Badge ${i}`);
        }
      }
    },
    setAllPokemon: (state, action) => {
      state.all = action.payload; // tableau avec les 151 noms { name: "pikachu" }
    },
  }
});

export const { addToPokedex, setAllPokemon } = pokedexSlice.actions;
export default pokedexSlice.reducer;