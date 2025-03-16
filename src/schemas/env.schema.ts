import { z } from "zod";

/**
 * 環境変数のスキーマ定義
 */
export const envSchema = z
  .object({
    /** アプリケーション名 */
    appName: z.string(),
    /** デフォルトのdescription */
    defaultDescription: z.string(),
  })
  .readonly();

/**
 * 環境変数の型定義
 */
export type EnvSchema = z.infer<typeof envSchema>;
