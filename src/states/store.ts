import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { postsApi } from '@/states/posts';
import { usersReducer as users } from '@/states/users';

const reducer = combineReducers({ users, [postsApi.reducerPath]: postsApi.reducer });
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(postsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});
