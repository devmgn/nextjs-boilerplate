import { DefaultApi } from "../openapi/apis/DefaultApi";
import { Configuration } from "../openapi/runtime";

const DefaultConfig = new Configuration();
export const apiClient = new DefaultApi(DefaultConfig);
