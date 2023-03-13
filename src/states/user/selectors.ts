import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/types/store';

export const selectUser = (state: RootState) => state.user;
export const selectUserName = createSelector(selectUser, (user) => user.name);
export const selectUserId = createSelector(selectUser, (user) => user.id);
