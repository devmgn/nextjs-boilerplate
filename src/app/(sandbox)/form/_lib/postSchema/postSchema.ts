import { z } from "zod";

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export type PostSchema = z.infer<typeof postSchema>;
