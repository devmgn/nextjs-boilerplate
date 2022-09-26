import { createContext, useCallback } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { rgba } from 'polished';
import ReactFocusLock from 'react-focus-lock';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';
import Portal from '@/components/ui/Portal';
import { MODAL_TRANSITION_DURATION } from '@/constants';
export { default as useModalState } from '@/hooks/useModalState';

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
  onDeactivate: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isActive, deactivate, onDeactivate, children }) => {
  const onExitComplete = useCallback(() => {
    enablePageScroll();
  }, []);

  const onAnimationStart = useCallback<(definition: any) => void>((definition) => {
    if ('opacity' in definition && definition.opacity === 1) {
      disablePageScroll();
    }
  }, []);

  return (
    <Portal>
      <modalContext.Provider value={{ isActive, deactivate }}>
        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {isActive && (
            <ReactFocusLock returnFocus>
              <StyledModal
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: MODAL_TRANSITION_DURATION }}
                onClick={onDeactivate}
                onAnimationStart={onAnimationStart}
              >
                {children}
              </StyledModal>
            </ReactFocusLock>
          )}
        </AnimatePresence>
      </modalContext.Provider>
    </Portal>
  );
};

export default Modal;
