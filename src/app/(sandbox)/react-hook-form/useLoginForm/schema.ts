import {
  type InferInput,
  email,
  maxLength,
  minLength,
  object,
  pipe,
  string,
} from "valibot";

export const LoginSchema = object({
  email: pipe(string(), maxLength(8), email()),
  password: pipe(string(), minLength(8), maxLength(255)),
});

export type LoginRequest = InferInput<typeof LoginSchema>;
