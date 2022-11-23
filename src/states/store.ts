import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer as user } from './user/slice';

const reducer = combineReducers({ user });
const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
