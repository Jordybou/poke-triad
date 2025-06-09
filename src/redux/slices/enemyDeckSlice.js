import { createSlice } from '@reduxjs/toolkit';
import { generateDeck } from '../../utils/generate';

const initialState = {
  deck: [],
};

const enemyDeckSlice = createSlice({
  name: 'enemy',
  initialState,
  reducers: {
    setEnemyDeck(state, action) {
      state.deck = action.payload;
    },
    removeCardFromEnemyDeck(state, action) {
      state.deck = state.deck.filter(card => card.id !== action.payload);
    }
  },
});

export const generateEnemyDeck = () => async (dispatch) => {
  try {
    const deck = await generateDeck();
    dispatch(setEnemyDeck(deck));
  } catch (error) {
    console.error("❌ Erreur lors de la génération du deck ennemi :", error);
  }
};

export const { setEnemyDeck, removeCardFromEnemyDeck } = enemyDeckSlice.actions;
export const selectEnemyDeck = (state) => state.enemy.deck;
export default enemyDeckSlice.reducer;