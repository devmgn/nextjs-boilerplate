import Ky from "ky";
import { requestToSnakeCase } from "./utils/requestToSnakeCase";
import { responseToCamelCase } from "./utils/responseToCamelCase";

export const ky = Ky.create({
  retry: 0,
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
