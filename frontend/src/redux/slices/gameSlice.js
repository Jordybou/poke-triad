import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'playing', // 'playing' | 'ended'
  turn: 'player',    // 'player' | 'enemy'
  forcedCardIndex: null, // Pour la règle Ordre
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame(state) {
      state.status = 'playing';
      state.turn = 'player';
    },
    endGame(state) {
      state.status = 'ended';
    },
    switchTurn(state) {
      state.turn = state.turn === 'player' ? 'enemy' : 'player';
    },
    setForcedCardIndex(state, action) {
      state.forcedCardIndex = action.payload;
    }
  },
});

export const { resetGame, endGame, switchTurn, setForcedCardIndex } = gameSlice.actions;
export const selectGameStatus = (state) => state.game.status;
export const selectTurn = (state) => state.game.turn;
export const selectForcedCardIndex = (state) => state.game.forcedCardIndex;

export default gameSlice.reducer;