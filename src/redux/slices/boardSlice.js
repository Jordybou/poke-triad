import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grid: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    placeCard: (state, action) => {
      const { row, col, card } = action.payload;

      if (!state.grid[row] || typeof state.grid[row][col] === 'undefined') {
        return;
      }

      if (state.grid[row][col] === null) {
        state.grid[row][col] = card;
      }
    },
    setBoard: (state, action) => {
      state.grid = action.payload;
    },
    resetBoard: () => ({
      grid: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
    }),
  },
});

export const { placeCard, resetBoard, setBoard } = boardSlice.actions;
export const selectBoard = (state) => state.board.grid;
export default boardSlice.reducer;