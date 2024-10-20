import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "./schema";
import type { LoginRequest } from "./schema";

export const useLoginForm = () => {
  const form = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const submit = form.handleSubmit(() => {
    // Do something
  });

  return { form, submit };
};
