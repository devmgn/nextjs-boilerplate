'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { post } from './getPost';

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
