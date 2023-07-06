'use client';

import { useRef, useMemo, useCallback, useEffect } from 'react';
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
  padding: 24px;
  pointer-events: none;
  outline: none;
`;

ModalRoot.defaultProps = {
  className: 'ModalRoot',
};

const ModalContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
  > * {
    pointer-events: auto;
  }
`;

ModalContainer.defaultProps = {
  className: 'ModalContainer',
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

  const modalNodeCallback = useCallback((callback: (node: HTMLDivElement) => void) => {
    if (!modalRef.current) {
      return;
    }
    callback(modalRef.current);
  }, []);

  const closeOnClick = useCallback(
    ({ target }: MouseEvent) => {
      modalNodeCallback((node) => {
        const shouldClose =
          target instanceof HTMLElement
            ? Boolean(target.closest(closeTriggerAttribute)) &&
              node.contains(document.activeElement)
            : false;
        if (shouldClose) {
          close();
        }
      });
    },
    [closeTriggerAttribute, close, modalNodeCallback],
  );

  const closeOnEscKeydown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (disableCloseOnEscKeydown) {
        return;
      }
      modalNodeCallback((node) => {
        const shouldClose = key === 'Escape' && node.contains(document.activeElement);
        if (shouldClose) {
          close();
        }
      });
    },
    [close, disableCloseOnEscKeydown, modalNodeCallback],
  );

  const lockScroll = useCallback(() => {
    modalNodeCallback((node) => {
      disableBodyScroll(node, {
        reserveScrollBarGap: true,
        allowTouchMove: (target) => (target instanceof Node ? node.contains(target) : false),
      });
    });
  }, [modalNodeCallback]);

  const clearLockedScroll = useCallback(() => {
    modalNodeCallback((node) => enableBodyScroll(node));
  }, [modalNodeCallback]);

  useEffect(() => {
    document.addEventListener('click', closeOnClick);
    document.addEventListener('keydown', closeOnEscKeydown);
    return () => {
      document.removeEventListener('click', closeOnClick);
      document.removeEventListener('keydown', closeOnEscKeydown);
    };
  }, [closeOnClick, closeOnEscKeydown]);

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
        nodeRef={modalRef}
        classNames={CSS_TRANSITION_CLASSNAMES}
        onEnter={lockScroll}
        onExited={clearLockedScroll}
      >
        <StyledModal ref={modalRef} transitionDuration={timeout}>
          <Backdrop onClick={close} />
          <FocusLock {...focusLockProps} as={ModalRoot} lockProps={{ tabIndex: 0 }}>
            <ModalContainer className="ModalContainer">
              <ModalProvider isOpen={isOpen} close={close}>
                {children}
              </ModalProvider>
            </ModalContainer>
          </FocusLock>
        </StyledModal>
      </CSSTransition>
    </Portal>
  );
};

export default Modal;
