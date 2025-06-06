"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { startTransition, useActionState } from "react";
import { createFormControl, Form, useFormState } from "react-hook-form";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { Input } from "../../../components/Input";
import { post } from "./action";
import { type PostSchema, postSchema } from "./schema";

const form = createFormControl<PostSchema>({
  resolver: standardSchemaResolver(postSchema),
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

  return (
    <Form
      className="grid-template-cols-[auto] grid max-w-2xl gap-4"
      control={control}
      onSubmit={({ data }) => {
        startTransition(() => formAction(data));
      }}
    >
      <Field errorMessage={errors.userId?.message} label="User ID">
        <Input
          {...register("userId", { valueAsNumber: true })}
          disabled={true}
          id="userId"
          type="number"
        />
      </Field>
      <Field errorMessage={errors.id?.message} label="ID">
        <Input {...register("id", { valueAsNumber: true })} type="number" />
      </Field>
      <Field errorMessage={errors.title?.message} label="Title">
        <Input {...register("title")} />
      </Field>
      <Field errorMessage={errors.body?.message} label="Body">
        <Input {...register("body")} />
      </Field>
      <Button disabled={isPending} type="submit">
        {isPending ? "Pending" : "Submit"}
      </Button>
    </Form>
  );
}
