import { configureStore } from '@reduxjs/toolkit';
import reducer from './ducks/reducers';

export const store = configureStore({ reducer });
