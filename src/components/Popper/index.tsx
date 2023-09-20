'use client';

import { cloneElement, forwardRef, isValidElement, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { usePopper } from 'react-popper';
import styled, { useTheme } from 'styled-components';
import Portal from '../Portal';
import PopperRoot from './PopperRoot';
import type { WithChildrenProps } from '@/types';
import type React from 'react';
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import type { OverrideProperties } from 'type-fest';

const StyledPopper = styled.div({});

const Arrow = styled.span({});

type PopperProps = {
  popperContent: React.ReactNode;
  cssTransitionProps?: OverrideProperties<
    CSSTransitionProps,
    { timeout?: number }
  >;
  popperOptions?: Parameters<typeof usePopper>[2];
  popperComponent?: React.ElementType;
  arrowComponent?: React.ElementType;
  arrowOptions?: Parameters<typeof usePopper>[2];
} & WithChildrenProps;

const Popper: React.FC<PopperProps> = forwardRef(
  (
    {
      popperContent,
      cssTransitionProps,
      popperOptions,
      popperComponent,
      arrowComponent,
      children,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [referenceElement, setReferenceElement] =
      useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
      null,
    );
    const [arrowElement, setArrowElement] = useState<HTMLSpanElement | null>(
      null,
    );
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      ...popperOptions,
      modifiers: [
        ...(popperOptions?.modifiers ?? []),
        { name: 'arrow', options: { element: arrowElement } },
      ],
    });

    if (!(children && isValidElement(children))) {
      return null;
    }

    return (
      <>
        {cloneElement(children, {
          ...children.props,
          ref: mergeRefs([ref, setReferenceElement]),
        })}
        <Portal>
          <PopperRoot
            timeout={
              cssTransitionProps?.timeout
                ? cssTransitionProps.timeout
                : theme.transitions.duration.short
            }
            unmountOnExit
            {...cssTransitionProps}
          >
            <StyledPopper
              as={popperComponent}
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              {popperContent}
              {arrowComponent && (
                <Arrow
                  as={arrowComponent}
                  ref={setArrowElement}
                  style={styles.arrow}
                  {...attributes.popper}
                />
              )}
            </StyledPopper>
          </PopperRoot>
        </Portal>
      </>
    );
  },
);

Popper.defaultProps = {
  popperComponent: undefined,
  cssTransitionProps: undefined,
  popperOptions: undefined,
};

Popper.displayName = 'Popper';

export default Popper;
