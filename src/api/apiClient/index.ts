import { Configuration, DefaultApi } from "../openapi";

const DefaultConfig = new Configuration({});
export const apiClient = new DefaultApi(DefaultConfig);
