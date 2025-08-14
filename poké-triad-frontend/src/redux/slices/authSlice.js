// Slice Redux pour l'auth (utilisateur courant) + thunks pour l'API
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthAPI } from '../../api';

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => await AuthAPI.me());
export const login = createAsyncThunk('auth/login', async ({ email, password }) => await AuthAPI.login(email, password));
export const register = createAsyncThunk('auth/register', async ({ email, password }) => await AuthAPI.register(email, password));
export const logout = createAsyncThunk('auth/logout', async () => await AuthAPI.logout());

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(fetchMe.rejected, (s, a) => { s.status = 'failed'; s.error = String(a.error?.message || 'err'); })
      .addCase(login.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(register.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(logout.fulfilled, (s) => { s.user = null; });
  },
});

export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;