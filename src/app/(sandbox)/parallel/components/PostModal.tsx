"use client";

import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { ModalContent } from "./ModalContent";

interface PostModalProps {
  id: string;
  isIntercepted?: boolean;
}

export function PostModal({ id, isIntercepted = false }: PostModalProps) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          return;
        }

        if (isIntercepted) {
          router.back();
        } else {
          router.replace("/parallel", { scroll: false });
        }
      }}
    >
      <DialogContent>
        <Suspense fallback={<span>🔄</span>}>
          <div>
            <ModalContent id={id} />
          </div>
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
