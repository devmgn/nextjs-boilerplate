import { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, m } from 'framer-motion';
import ReactFocusLock from 'react-focus-lock';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { TRANSITION, VARIANTS } from '@/constants/framerMotion';
import modalContext from '@/contexts/modalContext';
import Portal from './Portal';
import type useModal from '@/hooks/useModal';

const StyledModal = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
`;

const Backdrop = styled(m.div)`
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.6);
`;

type ModalProps = {
  children: React.ReactNode;
} & Omit<ReturnType<typeof useModal>, 'activate'>;

const Modal: React.FC<ModalProps> = ({ isActive, deactivate, handleDeactivate, children }) => {
  const onExitComplete = useCallback(() => {
    enablePageScroll();
  }, []);

  const onAnimationStart = useCallback((definition: keyof typeof VARIANTS) => {
    if (definition === 'active') {
      disablePageScroll();
    }
  }, []);

  const contextValue = useMemo(() => ({ isActive, deactivate }), [deactivate, isActive]);

  return (
    <modalContext.Provider value={contextValue}>
      <Portal>
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {isActive && (
            <ReactFocusLock returnFocus>
              <StyledModal onClick={handleDeactivate}>
                <Backdrop
                  key="modal-backdrop"
                  initial="inactive"
                  animate="active"
                  exit="inactive"
                  variants={VARIANTS}
                  transition={TRANSITION}
                  onAnimationStart={onAnimationStart}
                  role="presentation"
                  data-modal-deactivate
                />
                {children}
              </StyledModal>
            </ReactFocusLock>
          )}
        </AnimatePresence>
      </Portal>
    </modalContext.Provider>
  );
};

export default Modal;
