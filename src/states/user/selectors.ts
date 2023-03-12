import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/types/states';

export const selectUser = (state: RootState) => state.user;
export const selectUserName = createSelector(selectUser, (user) => user.name);
