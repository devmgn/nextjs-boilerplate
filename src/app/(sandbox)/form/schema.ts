import { z } from "zod";

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type PostSchema = z.infer<typeof postSchema>;
