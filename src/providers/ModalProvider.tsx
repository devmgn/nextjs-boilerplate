import { createContext, useMemo } from 'react';
import type Modal from '@/components/Modal';
import type { WithChildrenProps } from '@/types';

type ModalContextValue = Pick<React.ComponentProps<typeof Modal>, 'isOpen' | 'close'>;

export const ModalContext = createContext<ModalContextValue>({
  isOpen: false,
  close: () => {},
});

type ModalProviderProps = ModalContextValue & WithChildrenProps;

const ModalProvider: React.FC<ModalProviderProps> = ({ isOpen, close, children }) => {
  const value = useMemo(() => ({ isOpen, close }), [isOpen, close]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export default ModalProvider;
