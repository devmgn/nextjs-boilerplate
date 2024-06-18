'use client';

import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { post } from './getPost';

interface PostModalProps {
  id: string;
}

export function PostModal({ id }: PostModalProps) {
  const router = useRouter();
  const { data } = useSuspenseQuery(post.item(id));

  return (
    <Dialog
      defaultOpen={!!id}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.push('/parallel', { scroll: false });
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>{data.body}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
