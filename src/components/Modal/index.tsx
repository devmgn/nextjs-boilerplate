'use client';

import { useCallback, useMemo, useRef } from 'react';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock-upgrade';
import FocusLock from 'react-focus-lock';
import { CSSTransition } from 'react-transition-group';
import { useUnmount } from 'react-use';
import { useTheme } from 'styled-components';
import Backdrop from '../Backdrop';
import Portal from '../Portal';
import ModalContainer from './ModalContainer';
import ModalRoot from './ModalRoot';
import type { WithChildrenProps } from '@/types';
import type { ReactFocusLockProps } from 'react-focus-lock/interfaces';

export type ModalProps = {
  isOpen: boolean;
  close: () => void;
  transitionDuration?: number;
  closeTriggerAttribute?: string;
  disableCloseOnEscKeydown?: boolean;
  focusLockProps?: Omit<ReactFocusLockProps, 'as' | 'lockProps'>;
} & WithChildrenProps;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  close,
  transitionDuration,
  disableCloseOnEscKeydown = false,
  focusLockProps,
  children,
}) => {
  const theme = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  const timeout = useMemo(() => {
    return transitionDuration ?? theme.transitions.duration.enteringScreen;
  }, [theme.transitions.duration.enteringScreen, transitionDuration]);

  const closeOnEscKeydown = useCallback(
    ({ key }: React.KeyboardEvent<HTMLDivElement>) => {
      const shouldClose =
        key === 'Escape' && modalRef.current?.contains(document.activeElement);
      if (!disableCloseOnEscKeydown && shouldClose) {
        close();
      }
    },
    [close, disableCloseOnEscKeydown],
  );

  const modalRefCallback = useCallback(
    (callback: (element: HTMLDivElement) => void) => {
      if (!modalRef.current) {
        return;
      }
      callback(modalRef.current);
    },
    [],
  );

  const lockScroll = useCallback(() => {
    modalRefCallback((element) => {
      disableBodyScroll(element, {
        reserveScrollBarGap: true,
        allowTouchMove: (target) =>
          target instanceof Node ? element.contains(target) : false,
      });
    });
  }, [modalRefCallback]);

  const clearLockedScroll = useCallback(() => {
    modalRefCallback(enableBodyScroll);
  }, [modalRefCallback]);

  useUnmount(() => {
    clearAllBodyScrollLocks();
    return null;
  });

  return (
    <Portal>
      <CSSTransition
        in={isOpen}
        unmountOnExit
        timeout={timeout}
        onEnter={lockScroll}
        onExited={clearLockedScroll}
      >
        <ModalRoot
          ref={modalRef}
          transitionDuration={timeout}
          onKeyDown={closeOnEscKeydown}
        >
          <Backdrop onClick={close} />
          <FocusLock
            returnFocus
            {...focusLockProps}
            as={ModalContainer}
            lockProps={{ tabIndex: 0 }}
          >
            {children}
          </FocusLock>
        </ModalRoot>
      </CSSTransition>
    </Portal>
  );
};

export default Modal;
