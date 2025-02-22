"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { post } from "./action";
import { type PostSchema, postSchema } from "./schema";

export default function Page() {
  const [lastResult, action] = useActionState(post, null);

  const [form, fields] = useForm<PostSchema>({
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: postSchema });
    },
  });

  return (
    <form {...getFormProps(form)} action={action} onSubmit={form.onSubmit}>
      <Input
        {...getInputProps(fields.userId, { type: "number" })}
        key={fields.userId.key}
      />
      <p>{fields.userId.errors}</p>
      <Input
        {...getInputProps(fields.id, { type: "number" })}
        key={fields.id.key}
      />
      <p>{fields.id.errors}</p>
      <Input
        {...getInputProps(fields.title, { type: "text" })}
        key={fields.title.key}
      />
      <p>{fields.title.errors}</p>
      <Input
        {...getInputProps(fields.body, { type: "text" })}
        key={fields.body.key}
      />
      <p>{fields.body.errors}</p>
      <Button type="submit">Submit</Button>
    </form>
  );
}
