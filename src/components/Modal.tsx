'use client';

import { useRef, useMemo, useCallback, useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock-upgrade';
import FocusLock from 'react-focus-lock';
import { CSSTransition } from 'react-transition-group';
import styled, { useTheme } from 'styled-components';
import { CSS_TRANSITION_CLASSNAMES } from '@/config/cssTransition';
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
  z-index: 1100;
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
  closableAttribute?: string;
  disableCloseOnEscKeydown?: boolean;
  focusLockProps?: Omit<ReactFocusLockProps, 'as' | 'lockProps'>;
} & WithChildrenProps;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  close,
  transitionDuration,
  closableAttribute = '[data-close-modal="true"]',
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
    ({ target }: MouseEvent) => {
      if (!modalRef.current) {
        return;
      }
      const shouldClose =
        target instanceof Element ? Boolean(target.closest(closableAttribute)) : false;
      if (shouldClose) {
        close();
      }
    },
    [closableAttribute, close]
  );

  const closeOnEscKeydown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (!modalRef.current || disableCloseOnEscKeydown) {
        return;
      }
      const shouldClose = key === 'Escape' && modalRef.current.contains(document.activeElement);
      if (shouldClose) {
        close();
      }
    },
    [close, disableCloseOnEscKeydown]
  );

  useEffect(() => {
    document.addEventListener('click', closeOnClick);
    document.addEventListener('keydown', closeOnEscKeydown);
    return () => {
      document.removeEventListener('click', closeOnClick);
      document.removeEventListener('keydown', closeOnEscKeydown);
    };
  }, [closeOnClick, closeOnEscKeydown]);

  useEffect(() => {
    const modalNode = modalRef.current;
    if (!modalNode) {
      return undefined;
    }

    if (isOpen) {
      disableBodyScroll(modalNode, {
        reserveScrollBarGap: true,
        allowTouchMove: (target) => (target instanceof Node ? modalNode.contains(target) : false),
      });
    }
    return () => enableBodyScroll(modalNode);
  }, [isOpen]);

  return (
    <Portal>
      <CSSTransition
        in={isOpen}
        unmountOnExit
        timeout={timeout}
        nodeRef={modalRef}
        classNames={CSS_TRANSITION_CLASSNAMES}
      >
        <StyledModal ref={modalRef} transitionDuration={timeout}>
          <Backdrop onClick={close} />
          <FocusLock {...focusLockProps} as={ModalRoot} lockProps={{ tabIndex: 0 }}>
            <ModalContainer>{children}</ModalContainer>
          </FocusLock>
        </StyledModal>
      </CSSTransition>
    </Portal>
  );
};

export default Modal;
