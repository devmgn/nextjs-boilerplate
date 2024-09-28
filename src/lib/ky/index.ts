// @ts-nocheck
import {
  requestToSnakeCase,
  responseToCamelCase,
} from "@alice-health/ky-hooks-change-case";
import Ky from "ky";

export const ky = Ky.create({
  retry: 0,
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
