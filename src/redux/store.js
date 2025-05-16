import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import pokedexReducer from './slices/pokedexSlice';
import decksReducer from './slices/decksSlice';
import rulesReducer from './slices/rulesSlice';
import playerDeckReducer from './slices/playerDeckSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    pokedex: pokedexReducer,
    decks: decksReducer,
    rules: rulesReducer,
    playerDeck: playerDeckReducer,
  },
});