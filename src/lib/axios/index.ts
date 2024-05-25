import Axios from 'axios';
import { requestInterceptor } from './requestInterceptor';
import { responseInterceptor } from './responseInterceptor';

/**
 * @see https://axios-http.com/ja/docs/instance
 */
export const axios = Axios.create({
  adapter: 'fetch',
});

axios.interceptors.response.use(...responseInterceptor);
axios.interceptors.request.use(...requestInterceptor);
