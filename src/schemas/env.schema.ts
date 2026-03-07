import { z } from "zod";

/**
 * 環境変数のスキーマ定義
 */
export const envSchema = z
  .object({
    /** サイトURL */
    SITE_URL: z.url(),
    /** アプリケーション名 */
    APP_NAME: z.string(),
    /** デフォルトのdescription */
    DEFAULT_DESCRIPTION: z.string(),
  })
  .readonly();
