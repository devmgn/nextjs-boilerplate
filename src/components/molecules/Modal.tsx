import { createContext, useCallback } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { rgba } from 'polished';
import FocusLockUI from 'react-focus-lock/UI';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';
import { sidecar } from 'use-sidecar';
import Portal from '@/components/layouts/Portal';
import { MODAL_TRANSITION_DURATION } from '@/constants';

export { default as useModalState } from '@/hooks/useModalState';

const FocusLockSidecar = sidecar(() => import(/* webpackPrefetch: true */ 'react-focus-lock/sidecar'));

export const StyledModal = styled(m.div)`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background-color: ${rgba('#000', 0.6)};
`;

type ModalContext = {
  isActive: boolean;
  deactivate: () => void;
};

export const modalContext = createContext<ModalContext>({ isActive: false, deactivate: () => {} });

type ModalProps = {
  isActive: boolean;
  deactivate: () => void;
  handleDeactivate: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isActive, deactivate, handleDeactivate, children }) => {
  const onExitComplete = useCallback(() => {
    enablePageScroll();
  }, []);

  const onAnimationStart = useCallback<(definition: 'active' | 'inactive') => void>((definition) => {
    if (definition === 'active') {
      disablePageScroll();
    }
  }, []);

  return (
    <modalContext.Provider value={{ isActive, deactivate }}>
      <Portal>
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {isActive && (
            <div>
              <FocusLockUI returnFocus sideCar={FocusLockSidecar}>
                <StyledModal
                  key="modal"
                  initial="inactive"
                  animate="active"
                  exit="inactive"
                  variants={{
                    active: { opacity: 1 },
                    inactive: { opacity: 0 },
                  }}
                  transition={{ duration: MODAL_TRANSITION_DURATION }}
                  onClick={handleDeactivate}
                  onAnimationStart={onAnimationStart}
                >
                  {children}
                </StyledModal>
              </FocusLockUI>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </modalContext.Provider>
  );
};

export default Modal;
