import { configureStore } from '@reduxjs/toolkit';
import pokedexReducer from './slices/pokedexSlice';
import rulesReducer from './slices/rulesSlice';
import playerDeckReducer from './slices/playerDeckSlice';

export const store = configureStore({
  reducer: {
    pokedex: pokedexReducer,
    rules: rulesReducer,
    playerDeck: playerDeckReducer,
  },
});