import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/types/states';

const usersSelector = (state: RootState) => state.user;

export const getUserName = createSelector(usersSelector, (user) => user.userName);

export const getLoginStatus = createSelector(usersSelector, (user) => user.isLogin);
