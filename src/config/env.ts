import z from "zod";

export const ENV = {
  /** アプリケーション名 */
  appName: z.string().parse(process.env.NEXT_PUBLIC_APP_NAME),
  /** デフォルトのdescription */
  defaultDescription: z
    .string()
    .parse(process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION),
} as const;
