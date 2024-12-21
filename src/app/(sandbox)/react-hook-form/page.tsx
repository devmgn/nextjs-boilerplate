"use client";

import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { useLoginForm } from "./useLoginForm";

export default function ReactHookForm() {
  const {
    submit,
    form: {
      register,
      formState: { errors },
    },
  } = useLoginForm();

  return (
    <main className="prose container">
      <h1 className="sm:text-4xl">react-hook-form example</h1>
      <form onSubmit={submit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} />
            {errors.email?.message && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password?.message && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit">送信</Button>
        </div>
      </form>
    </main>
  );
}
