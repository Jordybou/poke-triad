import { createSlice } from '@reduxjs/toolkit';

const pokedexSlice = createSlice({
  name: 'pokedex',
  initialState: {
    captured: [],
  },
  reducers: {
    addToPokedex: (state, action) => {
      const alreadyExists = state.captured.some(card => card.name === action.payload.name);
      if (!alreadyExists) {
        state.captured.push(action.payload);
      }
    },
  },
});

export const { addToPokedex } = pokedexSlice.actions;
export default pokedexSlice.reducer;