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
  },
});

export const { setEnemyDeck } = enemyDeckSlice.actions;
export const selectEnemyDeck = (state) => state.enemy.deck;
export default enemyDeckSlice.reducer;

// 👉 Thunk asynchrone à appeler dans Game.jsx
export const generateEnemyDeck = () => async (dispatch) => {
  const deck = await generateDeck();
  dispatch(setEnemyDeck(deck));
};