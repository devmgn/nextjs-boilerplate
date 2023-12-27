import { useCallback, useState } from 'react';

export const useDisclosure = (
  initialState = false,
  callbacks?: { onOpen?: () => void; onClose?: () => void },
) => {
  const [isOpen, toggleIsOpen] = useState(initialState);
  const { onOpen, onClose } = callbacks ?? {};

  const close = useCallback(() => {
    onClose?.();
    toggleIsOpen(false);
  }, [onClose, toggleIsOpen]);

  const open = useCallback(() => {
    onOpen?.();
    toggleIsOpen(true);
  }, [onOpen, toggleIsOpen]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [close, isOpen, open]);

  return [isOpen, { open, close, toggle }] as const;
};
