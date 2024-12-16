export const ENV = {
  /** アプリケーション名 */
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  /** デフォルトのdescription */
  defaultDescription: process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION,
} as const;
