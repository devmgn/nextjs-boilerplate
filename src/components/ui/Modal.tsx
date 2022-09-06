import React, { createContext, useCallback, useEffect, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';
import { fadeIn, fadeOut } from '@/components/foundation/keyframes';
import Portal from '@/components/ui/Portal';

const ModalDiv = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.3s ease-in-out forwards;

  &[aria-hidden='true'] {
    animation-name: ${fadeOut};
  }
  &[aria-busy='true'] {
    pointer-events: none;
  }
`;

type ModalContext = {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export const modalContext = createContext<ModalContext>({} as ModalContext);

type ModalProps = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isActive, setIsActive, children }) => {
  const [isHidden, setIsHidden] = useState(false);

  const onClick = useCallback(({ target }: React.MouseEvent | React.TouchEvent) => {
    if (target === document.querySelector(ModalDiv)) {
      setIsHidden(true);
    }
  }, []);

  const onAnimationStart = useCallback(() => {
    if (isHidden) {
      return;
    }
    disablePageScroll();
  }, [isHidden]);

  const onAnimationEnd = useCallback(() => {
    if (isHidden) {
      setIsActive(false);
      enablePageScroll();
    }
  }, [isHidden, setIsActive]);

  useEffect(() => {
    const onEscKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        setIsHidden(true);
      }
    };

    if (isActive) {
      document.addEventListener('keydown', onEscKeyDown);
    }
    return () => document.removeEventListener('keydown', onEscKeyDown);
  }, [isActive]);

  return (
    <>
      {isActive && (
        <modalContext.Provider value={{ setIsHidden }}>
          <Portal>
            <FocusLock autoFocus={false}>
              <ModalDiv
                aria-hidden={isHidden}
                onClick={onClick}
                onAnimationStart={onAnimationStart}
                onAnimationEnd={onAnimationEnd}
              >
                {children}
              </ModalDiv>
            </FocusLock>
          </Portal>
        </modalContext.Provider>
      )}
    </>
  );
};

export default Modal;
