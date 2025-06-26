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
      state.deck = state.deck.filter(card => card.id !== action.payload);
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