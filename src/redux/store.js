import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import pokedexReducer from './slices/pokedexSlice';
import decksReducer from './slices/decksSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    pokedex: pokedexReducer,
    decks: decksReducer,
  },
});