"use client";

import type { ArticleSchema } from "./_lib/article-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { Form, createFormControl, useFormState } from "react-hook-form";
import { createArticle } from "./_actions/create-article";
import { articleSchema } from "./_lib/article-schema";
import { Button } from "../../../components/button";
import { Field } from "../../../components/form/field";
import { Input } from "../../../components/form/input";

const form = createFormControl<ArticleSchema>({
  resolver: zodResolver(articleSchema),
  defaultValues: {
    title: "Default Title",
    description: "Default Description",
    body: "Default Body",
    tags: "nextjs, react",
  },
});

export default function Page() {
  const [state, formAction, isPending] = useActionState(createArticle, null);
  const { control, register } = form;
  const { errors } = useFormState({ control });

  return (
    <Form
      className="grid max-w-2xl gap-4"
      control={control}
      onSubmit={({ data }) => {
        startTransition(() => {
          formAction(data);
        });
      }}
    >
      <Field
        errorMessage={errors.title?.message}
        label="Title"
        render={(props) => <Input {...register("title")} {...props} />}
      />
      <Field
        errorMessage={errors.description?.message}
        label="Description"
        render={(props) => <Input {...register("description")} {...props} />}
      />
      <Field
        errorMessage={errors.body?.message}
        label="Body"
        render={(props) => <Input {...register("body")} {...props} />}
      />
      <Field
        errorMessage={errors.tags?.message}
        label="Tags (comma separated)"
        render={(props) => <Input {...register("tags")} {...props} />}
      />
      <Button disabled={isPending} type="submit">
        {isPending ? "Pending" : "Submit"}
      </Button>
      {state && <output>{state.message}</output>}
    </Form>
  );
}
