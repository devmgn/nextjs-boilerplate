import { z } from "zod";

/** Input schema for the article form */
export const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  body: z.string().min(1),
  /** Comma-separated tags. Converted to an array on submit */
  tags: z.string(),
});

/** Input values of the article form */
export type ArticleSchema = z.infer<typeof articleSchema>;
