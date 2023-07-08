'use client';

import { useRef, useMemo, useCallback } from 'react';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock-upgrade';
import FocusLock from 'react-focus-lock';
import { CSSTransition } from 'react-transition-group';
import { useUnmount } from 'react-use';
import styled, { useTheme } from 'styled-components';
import { CSS_TRANSITION_CLASSNAMES } from '@/config/cssTransition';
import ModalProvider from '@/providers/ModalProvider';
import createShouldForwardProp from '@/utils/createShouldForwardProp';
import Backdrop from './Backdrop';
import Portal from './Portal';
import type { WithChildrenProps } from '@/types';
import type { ReactFocusLockProps } from 'react-focus-lock/interfaces';

const StyledModal = styled.div.withConfig({
  shouldForwardProp: createShouldForwardProp('transitionDuration'),
})<NonNullable<Pick<ModalProps, 'transitionDuration'>>>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.modal};
  & {
    .Backdrop {
      opacity: 0;
      transition: ${({ theme, transitionDuration }) =>
        theme.transitions.create(['opacity'], { duration: transitionDuration })};
    }
    .ModalRoot {
      opacity: 0;
      transition: ${({ theme, transitionDuration }) =>
        theme.transitions.create(['opacity', 'translate'], { duration: transitionDuration })};
      translate: 0 24px;
    }
  }

  &.enterDone {
    .Backdrop {
      opacity: 1;
    }
    .ModalRoot {
      opacity: 1;
      translate: none;
    }
  }
`;

const ModalRoot = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  pointer-events: none;
  outline: none;
  > * {
    pointer-events: auto;
  }
`;

ModalRoot.defaultProps = {
  className: 'ModalRoot',
};

type ModalProps = {
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
  closeTriggerAttribute = '[data-close-modal="true"]',
  disableCloseOnEscKeydown = false,
  focusLockProps,
  children,
}) => {
  const theme = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  const timeout = useMemo(() => {
    return transitionDuration !== undefined
      ? transitionDuration
      : theme.transitions.duration.enteringScreen;
  }, [theme.transitions.duration.enteringScreen, transitionDuration]);

  const closeOnClick = useCallback(
    ({ target }: React.MouseEvent<HTMLDivElement>) => {
      const shouldClose =
        target instanceof HTMLElement
          ? Boolean(target.closest(closeTriggerAttribute)) &&
            modalRef.current?.contains(document.activeElement)
          : false;

      if (shouldClose) {
        close();
      }
    },
    [close, closeTriggerAttribute],
  );

  const closeOnEscKeydown = useCallback(
    ({ key }: React.KeyboardEvent<HTMLDivElement>) => {
      const shouldClose = key === 'Escape' && modalRef.current?.contains(document.activeElement);
      if (disableCloseOnEscKeydown || !shouldClose) {
        return;
      }
      close();
    },
    [close, disableCloseOnEscKeydown],
  );

  const modalRefCallback = useCallback((callback: (element: HTMLDivElement) => void) => {
    if (!modalRef.current) {
      return;
    }
    callback(modalRef.current);
  }, []);

  const lockScroll = useCallback(() => {
    modalRefCallback((element) => {
      disableBodyScroll(element, {
        reserveScrollBarGap: true,
        allowTouchMove: (target) => (target instanceof Node ? element.contains(target) : false),
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
        timeout={{ exit: timeout }}
        classNames={CSS_TRANSITION_CLASSNAMES}
        onEnter={lockScroll}
        onExited={clearLockedScroll}
        nodeRef={modalRef}
      >
        <StyledModal
          ref={modalRef}
          transitionDuration={timeout}
          onClick={closeOnClick}
          onKeyDown={closeOnEscKeydown}
        >
          <Backdrop onClick={close} />
          <FocusLock returnFocus {...focusLockProps} as={ModalRoot} lockProps={{ tabIndex: 0 }}>
            <ModalProvider isOpen={isOpen} close={close}>
              {children}
            </ModalProvider>
          </FocusLock>
        </StyledModal>
      </CSSTransition>
    </Portal>
  );
};

export default Modal;
