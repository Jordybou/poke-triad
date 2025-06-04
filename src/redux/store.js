import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import gameReducer from './slices/gameSlice';
import enemyDeckReducer from './slices/enemyDeckSlice';
import playerDeckReducer from './slices/playerDeckSlice';
import pokedexReducer from './slices/pokedexSlice';
import rulesReducer from './slices/rulesSlice';

export const store = configureStore({
  reducer: {
    board: boardReducer,
    game: gameReducer,
    enemy: enemyDeckReducer,
    playerDeck: playerDeckReducer,
    pokedex: pokedexReducer,
    rules: rulesReducer,
  },
});