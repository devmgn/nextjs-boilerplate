import { useCallback, useState } from 'react';

const useDisclosure = (defaultIsOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen ?? false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useDisclosure;
