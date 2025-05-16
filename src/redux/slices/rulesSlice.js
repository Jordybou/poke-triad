import { createSlice } from '@reduxjs/toolkit';
import { BADGES } from '../../utils/badges';

const initialState = {
  enabledRules: [],
};

export const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    toggleRule: (state, action) => {
      const rule = action.payload;
      if (state.enabledRules.includes(rule)) {
        state.enabledRules = state.enabledRules.filter(r => r !== rule);
      } else {
        state.enabledRules.push(rule);
      }
    },
    resetRules: (state) => {
      state.enabledRules = [];
    }
  },
});

export const { toggleRule, resetRules } = rulesSlice.actions;
export default rulesSlice.reducer;