import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/states/users';

const initialState: User[] = [];

export const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
  },
});

export const usersActions = usersSlice.actions;
export const { addUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
