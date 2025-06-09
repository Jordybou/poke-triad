import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialDeck = {
  id: nanoid(),
  name: 'Deck de départ',
  cards: [], // Rempli dynamiquement
};

const initialState = {
  decks: [initialDeck],
  activeDeckId: initialDeck.id,
};

const playerDeckSlice = createSlice({
  name: 'playerDeck',
  initialState,
  reducers: {
    // Remplace toutes les cartes d’un deck par défaut
    setPlayerDeck(state, action) {
      const active = state.decks.find(d => d.id === state.activeDeckId);
      if (active && Array.isArray(action.payload) && action.payload.length === 5) {
        active.cards = action.payload;
      }
    },

    // Ajoute un nouveau deck
    addDeck(state, action) {
      const newDeck = {
        id: nanoid(),
        name: action.payload.name || `Deck ${state.decks.length + 1}`,
        cards: action.payload.cards || [],
      };
      state.decks.push(newDeck);
    },

    // Duplique un deck existant
    duplicateDeck(state, action) {
      const copied = {
        ...action.payload,
        id: nanoid(),
        name: `${action.payload.name} (copie)`,
      };
      state.decks.push(copied);
    },

    // Supprime un deck (sauf si c’est le dernier)
    deleteDeck(state, action) {
      const filtered = state.decks.filter(deck => deck.id !== action.payload);
      if (filtered.length > 0) {
        state.decks = filtered;
        // Réaffecter un deck actif si nécessaire
        if (state.activeDeckId === action.payload) {
          state.activeDeckId = state.decks[0].id;
        }
      }
    },

    // Change le deck actif
    setActiveDeck(state, action) {
      state.activeDeckId = action.payload;
    },

    removeCardFromPlayerDeck(state, action) {
      const activeDeck = state.decks.find(d => d.id === state.activeDeckId);
      if (activeDeck) {
        activeDeck.cards = activeDeck.cards.filter(card => card.id !== action.payload);
      }
    }
  },
});

export const {
  setPlayerDeck,
  asyncResetPlayerDeck,
  addDeck,
  deleteDeck,
  duplicateDeck,
  setActiveDeck,
  removeCardFromPlayerDeck,
} = playerDeckSlice.actions;

export const selectDecks = (state) => state.playerDeck.decks;
export const selectActiveDeckId = (state) => state.playerDeck.activeDeckId;
export const selectPlayerDeck = (state) =>
  state.playerDeck.decks.find((deck) => deck.id === state.playerDeck.activeDeckId)?.cards || [];

export default playerDeckSlice.reducer;