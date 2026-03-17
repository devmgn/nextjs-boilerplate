"use client";

import type { PostSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useId } from "react";
import { Form, createFormControl, useFormState } from "react-hook-form";
import { post } from "./action";
import { postSchema } from "./schema";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { Input } from "../../../components/Input";

const form = createFormControl<PostSchema>({
  resolver: zodResolver(postSchema),
  defaultValues: {
    userId: 1,
    id: 1,
    title: "Default Title",
    body: "Default Body",
  },
});

export default function Page() {
  const [, formAction, isPending] = useActionState(post, null);
  const { control, register } = form;
  const { errors } = useFormState({ control });
  const id = useId();

  return (
    <Form
      className="grid-template-cols-[auto] grid max-w-2xl gap-4"
      control={control}
      onSubmit={({ data }) => {
        startTransition(() => {
          formAction(data);
        });
      }}
    >
      <Field errorMessage={errors.userId?.message} label="User ID">
        {({ isError }) => (
          <Input
            {...register("userId", { valueAsNumber: true })}
            id={id}
            isError={isError}
            type="number"
          />
        )}
      </Field>
      <Field errorMessage={errors.id?.message} label="ID">
        {({ isError }) => (
          <Input
            {...register("id", { valueAsNumber: true })}
            isError={isError}
            type="number"
          />
        )}
      </Field>
      <Field errorMessage={errors.title?.message} label="Title">
        {({ isError }) => <Input {...register("title")} isError={isError} />}
      </Field>
      <Field errorMessage={errors.body?.message} label="Body">
        {({ isError }) => <Input {...register("body")} isError={isError} />}
      </Field>
      <Button disabled={isPending} type="submit">
        {isPending ? "Pending" : "Submit"}
      </Button>
    </Form>
  );
}
