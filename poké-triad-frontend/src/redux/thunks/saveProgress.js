import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProgressAPI } from '../../api';
import { buildProgress } from '../../utils/progress';
import { selectUser } from '../slices/authSlice';

export const saveProgress = createAsyncThunk('progress/save', async (_, { getState }) => {
  const state = getState();
  const user = selectUser(state);
  const payload = buildProgress(state);

  if (user) {
    // Sauvegarde côté serveur si connecté
    await ProgressAPI.put(payload);
    return { mode: 'server' };
  } else {
    // Sauvegarde locale pour invité
    localStorage.setItem('triad_progress', JSON.stringify(payload));
    return { mode: 'local' };
  }
});