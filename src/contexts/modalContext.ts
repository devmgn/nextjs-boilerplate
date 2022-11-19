import { createContext } from 'react';

type ModalContext = {
  isActive: boolean;
  deactivate: () => void;
};

export const modalContext = createContext<ModalContext>({
  isActive: false,
  deactivate: () => {},
});
