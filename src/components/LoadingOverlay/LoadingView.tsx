"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Spinner } from "../Spinner";

interface LoadingViewProps extends DialogProps {
  open: boolean;
}

/**
 * 全画面ローディングの視覚層。Radix Dialog をベースに focus trap / scroll lock を効かせ、
 * loading 中は Esc・外側クリックで閉じないよう preventDefault する。
 * Spinner は Dialog.Title (visually hidden) と兄弟にして AT に読み上げさせる。
 */
export function LoadingView(props: LoadingViewProps) {
  const { open, ...rest } = props;

  return (
    <Dialog open={open} {...rest}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs select-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <DialogContent
          aria-describedby={undefined}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center focus:outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
          onEscapeKeyDown={(event) => {
            event.preventDefault();
          }}
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
          }}
        >
          <DialogTitle className="sr-only">Loading</DialogTitle>
          <Spinner size="xl" />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
