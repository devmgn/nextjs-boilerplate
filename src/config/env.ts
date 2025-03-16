import { envSchema } from "../schemas/env.schema";

export const ENV = envSchema.parse({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  defaultDescription: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
});
