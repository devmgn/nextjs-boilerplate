import { createContext, useMemo } from 'react';
import type Modal from '@/components/Modal';
import type { WithChildrenProps } from '@/types';

type ModalContext = Pick<React.ComponentProps<typeof Modal>, 'isOpen' | 'close'>;

export const modalContext = createContext<ModalContext>({
  isOpen: false,
  close: () => {},
});

type ModalProviderProps = ModalContext & WithChildrenProps;

const ModalProvider: React.FC<ModalProviderProps> = ({ isOpen, close, children }) => {
  const value = useMemo(() => ({ isOpen, close }), [isOpen, close]);

  return <modalContext.Provider value={value}>{children}</modalContext.Provider>;
};

export default ModalProvider;
