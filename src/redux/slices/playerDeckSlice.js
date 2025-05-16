import { createSlice, nanoid } from '@reduxjs/toolkit';
import { defaultDeck } from '../../utils/defaultDeck';

const initialState = {
  decks: [
    {
      id: 'default',
      name: 'Deck de base',
      cards: defaultDeck
    }
  ],
  activeDeckId: 'default'
};

const playerDeckSlice = createSlice({
  name: 'playerDeck',
  initialState,
  reducers: {
    addDeck: {
      reducer(state, action) {
        state.decks.push(action.payload);
      },
      prepare(name, cards) {
        return {
          payload: {
            id: nanoid(),
            name,
            cards,
          }
        };
      }
    },

    updateDeck(state, action) {
      const { id, name, cards } = action.payload;
      const existingDeck = state.decks.find(deck => deck.id === id);
      if (existingDeck) {
        if (name !== undefined) existingDeck.name = name;
        if (cards !== undefined) existingDeck.cards = cards;
      }
    },

    deleteDeck(state, action) {
      const idsToDelete = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.decks = state.decks.filter(deck => !idsToDelete.includes(deck.id));

      // Si le deck actif a été supprimé, on réinitialise
      if (idsToDelete.includes(state.activeDeckId)) {
        state.activeDeckId = state.decks.length > 0 ? state.decks[0].id : null;
      }
    },

    setActiveDeck(state, action) {
      state.activeDeckId = action.payload;
    },

    duplicateDeck(state, action) {
      const deckToDuplicate = state.decks.find(deck => deck.id === action.payload);
      if (deckToDuplicate) {
        const copy = {
          id: nanoid(),
          name: `${deckToDuplicate.name} (copie)`,
          cards: [...deckToDuplicate.cards]
        };
        state.decks.push(copy);
      }
    },
  }
});

// Sélecteur utile : récupérer le deck actif
export const selectActiveDeck = (state) =>
  state.playerDeck.decks.find(deck => deck.id === state.playerDeck.activeDeckId);

export const {
  addDeck,
  updateDeck,
  deleteDeck,
  setActiveDeck,
  duplicateDeck
} = playerDeckSlice.actions;

export default playerDeckSlice.reducer;