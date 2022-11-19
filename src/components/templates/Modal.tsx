import { useCallback, useMemo } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { rgba } from 'polished';
import ReactFocusLock from 'react-focus-lock';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';
import { TRANSITION } from '@/constants/framerMotion';
import { modalContext } from '@/contexts/modalContext';
import useModal from '@/hooks/useModal';
import Portal from './Portal';

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
  background-color: ${rgba('#000', 0.6)};
`;

type ModalProps = {
  children: React.ReactNode;
} & Omit<ReturnType<typeof useModal>, 'activate'>;

const Modal: React.FC<ModalProps> = ({ isActive, deactivate, handleDeactivate, children }) => {
  const onExitComplete = useCallback(() => {
    enablePageScroll();
  }, []);

  const onAnimationStart = useCallback<(definition: 'active' | 'inactive') => void>(
    (definition) => {
      if (definition === 'active') {
        disablePageScroll();
      }
    },
    []
  );

  const contextValue = useMemo(() => ({ isActive, deactivate }), [deactivate, isActive]);

  return (
    <modalContext.Provider value={contextValue}>
      <Portal>
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {isActive && (
            <div tabIndex={-1}>
              <ReactFocusLock returnFocus>
                <StyledModal onClick={handleDeactivate}>
                  <Backdrop
                    key="modal-backdrop"
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    variants={{
                      active: { opacity: 1 },
                      inactive: { opacity: 0 },
                    }}
                    transition={TRANSITION}
                    onAnimationStart={onAnimationStart}
                    role="presentation"
                    data-modal-deactivate
                  />
                  {children}
                </StyledModal>
              </ReactFocusLock>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </modalContext.Provider>
  );
};

export default Modal;
