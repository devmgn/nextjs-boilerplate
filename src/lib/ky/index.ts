// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  requestToSnakeCase,
  responseToCamelCase,
} from "@alice-health/ky-hooks-change-case";
import Ky from "ky";

export const ky = Ky.create({
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
