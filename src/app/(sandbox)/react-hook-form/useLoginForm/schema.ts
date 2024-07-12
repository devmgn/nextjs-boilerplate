import * as v from "valibot";

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.maxLength(8), v.email()),
  password: v.pipe(v.string(), v.minLength(8), v.maxLength(255)),
});

export type LoginRequest = v.InferInput<typeof LoginSchema>;
