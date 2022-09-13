import { AnimatePresence, m } from 'framer-motion';
import ReactFocusLock from 'react-focus-lock';
import styled from 'styled-components';
import Portal from '@/components/ui/Portal';
import { MODAL_TRANSITION_DURATION } from '@/constants';

export const StyledModal = styled(m.div)`
  display: grid;
  position: fixed;
  inset: 0;
  place-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.6);
`;

type ModalProps = {
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isActive, onClick, children }) => {
  return (
    <Portal>
      <AnimatePresence mode="wait">
        {isActive && (
          <ReactFocusLock returnFocus>
            <StyledModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: MODAL_TRANSITION_DURATION }}
              onClick={onClick}
            >
              {children}
            </StyledModal>
          </ReactFocusLock>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Modal;
