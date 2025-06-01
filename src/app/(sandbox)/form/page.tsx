"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { startTransition, useActionState } from "react";
import { Form, useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { post } from "./action";
import { type PostSchema, postSchema } from "./schema";

export default function Page() {
  const [, formAction, isPending] = useActionState(post, null);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<PostSchema>({
    resolver: standardSchemaResolver(postSchema),
    defaultValues: {
      userId: 1,
      id: 1,
      title: "Default Title",
      body: "Default Body",
    },
  });

  return (
    <Form
      control={control}
      onSubmit={({ data }) => {
        startTransition(() => formAction(data));
      }}
    >
      <Input {...register("userId", { valueAsNumber: true })} type="number" />
      <p>{errors.userId?.message}</p>
      <Input {...register("id", { valueAsNumber: true })} type="number" />
      <p>{errors.id?.message}</p>
      <Input {...register("title")} />
      <p>{errors.title?.message}</p>
      <Input {...register("body")} />
      <p>{errors.body?.message}</p>
      <Button disabled={isPending} type="submit">
        {isPending ? "Pending" : "Submit"}
      </Button>
    </Form>
  );
}
