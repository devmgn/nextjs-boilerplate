import type { ValueOf } from "type-fest";

export const ENV_KEY = {
  /** アプリケーション名 */
  appName: "NEXT_PUBLIC_APP_NAME",
  /** デフォルトのdescription */
  defaultDescription: "NEXT_PUBLIC_DEFAULT_DESCRIPTION",
} as const;

export type EnvKey = ValueOf<typeof ENV_KEY>;
