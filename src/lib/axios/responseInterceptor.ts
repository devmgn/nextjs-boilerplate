import { camelCase } from 'change-case/keys';
import type { AxiosInterceptorManager, AxiosResponse } from 'axios';

export const responseInterceptor: Parameters<
  AxiosInterceptorManager<AxiosResponse>['use']
> = [
  (response) => {
    return {
      ...response,
      data: camelCase(response.data, Infinity),
    };
  },
];
