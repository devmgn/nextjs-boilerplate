import Ky from "ky";
import { requestToSnakeCase } from "./requestToSnakeCase";
import { responseToCamelCase } from "./responseToCamelCase";

export const ky = Ky.create({
  retry: 0,
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
