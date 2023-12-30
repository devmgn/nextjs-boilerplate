// @ts-expect-error - no types
import { camelCase } from 'change-case/keys';
import type { AxiosResponse } from 'axios';

export const responseResolvedInterceptor = (response: AxiosResponse) => {
  return Promise.resolve({
    ...response,
    data: camelCase(response.data, Infinity),
  });
};
