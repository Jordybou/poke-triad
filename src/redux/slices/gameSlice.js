import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'playing', // 'playing' | 'ended'
  turn: 'player',    // 'player' | 'enemy'
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: () => initialState,
    endGame(state) {
      state.status = 'ended';
    },
    switchTurn(state) {
      state.turn = state.turn === 'player' ? 'enemy' : 'player';
    },
  },
});

export const { resetGame, endGame, switchTurn } = gameSlice.actions;
export const selectGameStatus = (state) => state.game.status;
export const selectTurn = (state) => state.game.turn;
export default gameSlice.reducer;