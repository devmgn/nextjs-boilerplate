import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { createLogger } from 'redux-logger';
import userReducer from './user/slice';

const reducer = combineReducers({
  [userReducer.name]: userReducer.reducer,
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const logger = createLogger();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const makeStore = ({ reduxWrapperMiddleware }) =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return [
        ...getDefaultMiddleware(),
        process.env.NODE_ENV !== 'production' ? logger : null,
        reduxWrapperMiddleware,
      ].filter(Boolean);
    },
  });

const wrapper = createWrapper(makeStore);
export default wrapper;
