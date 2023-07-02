import { useContext } from 'react';
import { modalContext } from '@/providers/ModalProvider';

const useModalContext = () => useContext(modalContext);

export default useModalContext;
