import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        userName: action.payload,
      };
    },
    login: (state) => {
      return {
        ...state,
        isLogin: true,
      };
    },
    logout: (state) => {
      return {
        ...state,
        isLogin: false,
      };
    },
  },
});

export const userActions = userSlice.actions;
export const { setUserName, login, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
