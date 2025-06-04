import { createSlice } from '@reduxjs/toolkit';
import { generateDeck } from '../../utils/generate';

const initialState = {
  deck: generateDeck(),
};

const enemyDeckSlice = createSlice({
  name: 'enemy',
  initialState,
  reducers: {
    generateEnemyDeck(state) {
      state.deck = generateDeck();
    },
    setEnemyDeck(state, action) {
      state.deck = action.payload;
    },
  },
});

export const { generateEnemyDeck, setEnemyDeck } = enemyDeckSlice.actions;
export const selectEnemyDeck = (state) => state.enemy.deck;
export default enemyDeckSlice.reducer;