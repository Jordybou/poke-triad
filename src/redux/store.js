import { configureStore } from '@reduxjs/toolkit';

// Importation des reducers depuis les slices
import boardReducer from './slices/boardSlice';
import gameReducer from './slices/gameSlice';
import enemyDeckReducer from './slices/enemyDeckSlice';
import playerDeckReducer from './slices/playerDeckSlice';
import pokedexReducer from './slices/pokedexSlice';
import rulesReducer from './slices/rulesSlice';

// Création du store Redux avec tous les slices regroupés
export const store = configureStore({
  reducer: {
    board: boardReducer,         // Plateau de jeu
    game: gameReducer,           // Tour de jeu, état de la partie
    enemy: enemyDeckReducer,     // Deck de l’ennemi
    playerDeck: playerDeckReducer, // Decks du joueur (multiples)
    pokedex: pokedexReducer,     // Pokédex, progression et badges
    rules: rulesReducer,         // Règles spéciales débloquées/actives
  },
});