import Axios from 'axios';
import { responseResolvedInterceptor } from './responseResolvedInterceptor';

/**
 * @see https://axios-http.com/ja/docs/instance
 */
export const axios = Axios.create();

axios.interceptors.response.use(responseResolvedInterceptor);
