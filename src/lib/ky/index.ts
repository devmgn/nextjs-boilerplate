// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  requestToSnakeCase,
  responseToCamelCase,
} from '@alice-health/ky-hooks-change-case';
import ky from 'ky';

export const kyInstance = ky.create({
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
