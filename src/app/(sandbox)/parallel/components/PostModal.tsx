'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { ModalContent } from './ModalContent';

interface PostModalProps {
  id: string;
  isIntercepted?: boolean;
}

export function PostModal({ id, isIntercepted = false }: PostModalProps) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(isOpen) => {
        if (isOpen) return;

        if (isIntercepted) {
          router.replace('/parallel');
        } else {
          router.back();
        }
      }}
    >
      <DialogContent>
        <Suspense fallback={<Spinner />}>
          <DialogHeader>
            <ModalContent id={id} />
          </DialogHeader>
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
