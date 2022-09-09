import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/states/users';

const initialState: User[] = [];

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
  },
});

export const userActions = userSlice.actions;
export const { addUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
