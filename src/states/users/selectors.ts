import { createSelector } from '@reduxjs/toolkit';
import { memoize } from 'lodash';
import { RootState } from '@/states';

export const usersSelector = (state: RootState) => state.users;

export const selectLoginUsers = createSelector(usersSelector, (users) => users.filter((user) => user.isLogin));

export const selectUserByUid = memoize((uid: string) =>
  createSelector(usersSelector, (users) => {
    return users.find((user) => user.uid === uid);
  })
);
