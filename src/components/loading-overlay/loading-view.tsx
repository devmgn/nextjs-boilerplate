"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Spinner } from "../spinner";

interface LoadingViewProps extends DialogProps {
  open: boolean;
}

/**
 * Visual layer of the full-screen loading. Built on Radix Dialog for focus trap
 * / scroll lock, and calls preventDefault so Esc and outside clicks don't close
 * it while loading. Spinner is a sibling of Dialog.Title (visually hidden) so
 * assistive tech announces it.
 *
 * @param props - The visibility state `open` and Radix Dialog props.
 * @returns The full-screen loading dialog.
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
