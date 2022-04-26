import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Users } from '@/states/ducks';

const initialState: Users = [];

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
  },
});

export const { addUser } = slice.actions;

export default slice.reducer;
