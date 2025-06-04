import { createSlice } from '@reduxjs/toolkit';

const emptyBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const boardSlice = createSlice({
  name: 'board',
  initialState: emptyBoard,
  reducers: {
    placeCard: (state, action) => {
      const { row, col, card } = action.payload;
      state[row][col] = card;
    },
    resetBoard: () => emptyBoard,
  },
});

export const { placeCard, resetBoard } = boardSlice.actions;
export const selectBoard = (state) => state.board;
export default boardSlice.reducer;