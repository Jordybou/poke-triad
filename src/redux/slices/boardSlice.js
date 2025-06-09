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

      // 🛡 Vérifie que la ligne existe
      if (!state.grid[row]) return;

      // 🛡 Vérifie que la colonne existe dans la ligne
      if (typeof state.grid[row][col] === 'undefined') return;

      // 🧩 Si la case est vide, place la carte
      if (state.grid[row][col] === null) {
        state.grid[row][col] = card;
        
      }console.log("PLACEMENT EFFECTIF :", row, col, card);
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