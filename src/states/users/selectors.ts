import { createSelector } from '@reduxjs/toolkit';
import { memoize } from 'lodash';
import { StoreState } from '@/states';

export const usersSelector = (state: StoreState) => state.users;

export const selectLoginUsers = createSelector(usersSelector, (users) => users.filter((user) => user.isLogin));

export const selectUserByUid = memoize((uid: number) =>
  createSelector(usersSelector, (users) => {
    return users.find((user) => user.uid === uid);
  })
);
