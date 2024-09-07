import z from "zod";

export const LoginSchema = z.object({
  email: z.string().email().max(8),
  password: z.string().min(8).max(255),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
