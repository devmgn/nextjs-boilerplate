import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import type { User } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      return { ...state, ...payload };
    },
    setUserName: (state, { payload }: PayloadAction<User['name']>) => {
      return { ...state, name: payload };
    },
    setUserId: (state, { payload }: PayloadAction<User['id']>) => {
      return { ...state, id: payload };
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const userActions = userSlice.actions;
export const { setUser, setUserName, setUserId, clearUser } = userSlice.actions;
export default userSlice;
