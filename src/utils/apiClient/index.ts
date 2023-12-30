import { axios } from '@/lib';
import { ApiClient } from './ApiClient';

export const apiClient = new ApiClient(axios);
