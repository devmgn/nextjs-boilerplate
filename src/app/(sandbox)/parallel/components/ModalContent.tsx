"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { post } from "./getPost";

interface PostModalProps {
  id: string;
}

export function ModalContent({ id }: PostModalProps) {
  const { data } = useSuspenseQuery(post.item(id));

  return (
    <>
      <DialogTitle>{data.title}</DialogTitle>
      <DialogDescription>{data.body}</DialogDescription>
    </>
  );
}
