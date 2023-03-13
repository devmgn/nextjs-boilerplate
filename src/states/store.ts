import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import userSlice from './user/slice';

const reducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const makeStore = ({ reduxWrapperMiddleware }) =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return [...getDefaultMiddleware(), reduxWrapperMiddleware];
    },
  });

const wrapper = createWrapper(makeStore);
export default wrapper;
