import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deck: [], // Contiendra 5 cartes max
};

const playerDeckSlice = createSlice({
  name: 'playerDeck',
  initialState,
  reducers: {
    setPlayerDeck(state, action) {
      if (Array.isArray(action.payload) && action.payload.length === 5) {
        state.deck = action.payload;
      }
    },
    removeCardFromPlayerDeck(state, action) {
      console.log('Avant suppression', state.deck.map(c => c.idDex));
      state.deck = state.deck.filter(card => card.idDex !== action.payload);
      console.log('Après suppression', state.deck.map(c => c.idDex));
    },
    addCardToPlayerDeck(state, action) {
      if (state.deck.length < 5) {
        state.deck.push(action.payload);
      }
    },
    resetPlayerDeck(state) {
      state.deck = [];
    },
  },
});

export const {
  setPlayerDeck,
  removeCardFromPlayerDeck,
  addCardToPlayerDeck,
  resetPlayerDeck,
} = playerDeckSlice.actions;

export const selectPlayerDeck = (state) => state.playerDeck.deck;

export default playerDeckSlice.reducer;