'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { ModalContent } from './ModalContent';

interface PostModalProps {
  id: string;
}

export function PostModal({ id }: PostModalProps) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(isOpen) => {
        if (!isOpen) {
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
