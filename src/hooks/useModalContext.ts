import { useContext } from 'react';
import { ModalContext } from '@/providers/ModalProvider';

const useModalContext = () => useContext(ModalContext);

export default useModalContext;
