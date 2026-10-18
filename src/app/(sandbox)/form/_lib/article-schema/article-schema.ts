import { z } from "zod";

/** 記事作成フォームの入力スキーマ */
export const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  /** カンマ区切りのタグ。送信時に配列へ変換する */
  tags: z.string(),
});

/** 記事作成フォームの入力値 */
export type ArticleSchema = z.infer<typeof articleSchema>;
