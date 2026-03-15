import { z } from "zod";

const envSchema = z
  .object({
    SITE_URL: z.url(),
    APP_NAME: z.string(),
    DEFAULT_DESCRIPTION: z.string(),
  })
  .readonly();

export const ENV = envSchema.parse({
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  DEFAULT_DESCRIPTION: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
});
