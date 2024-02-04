import { snakeCase } from 'change-case/keys';
import type {
  AxiosInterceptorManager,
  InternalAxiosRequestConfig,
} from 'axios';

export const requestInterceptor: Parameters<
  AxiosInterceptorManager<InternalAxiosRequestConfig>['use']
> = [
  (config) => {
    return {
      ...config,
      params: snakeCase(config.params, Infinity),
      data:
        config.params instanceof FormData
          ? config.params
          : snakeCase(config.data, Infinity),
    };
  },
];
