import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('accessToken');
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

export const {
  login,
  logout,
  setLoading,
  setError,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;
