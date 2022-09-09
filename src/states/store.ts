import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer as users } from '@/states/users';

const reducer = combineReducers({ users });
export const store = configureStore({ reducer, devTools: process.env.NODE_ENV !== 'production' });
