'use client';

import { cloneElement, forwardRef, isValidElement, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { usePopper } from 'react-popper';
import { CSSTransition } from 'react-transition-group';
import styled, { useTheme } from 'styled-components';
import type { WithChildrenProps } from '@/types';
import type React from 'react';
import type { OverrideProperties } from 'type-fest';

const PopperRoot = styled(CSSTransition).attrs({ className: 'PopperRoot' })<{ timeout: number }>`
  visibility: hidden;
  opacity: 0;
  transition: ${({ theme, timeout }) =>
    theme.transitions.create(['opacity', 'visibility'], { duration: timeout })};
  &.enter,
  &.enterDone {
    visibility: visible;
    opacity: 1;
  }
`;

const StyledPopper = styled.div.attrs({ className: 'Popper' })``;

type PopperProps = {
  popperContent: React.ReactNode;
  cssTransitionProps?: OverrideProperties<
    React.ComponentPropsWithoutRef<typeof CSSTransition>,
    { timeout?: number }
  >;
  popperOptions?: Parameters<typeof usePopper>[2];
  components?: {
    popper?: React.ElementType;
    arrow?: React.ElementType;
  };
} & WithChildrenProps;

const Popper: React.FC<PopperProps> = forwardRef(
  ({ popperContent, cssTransitionProps, popperOptions, components, children }, ref) => {
    const theme = useTheme();
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, popperOptions);

    if (!(children && isValidElement(children))) {
      return null;
    }

    return (
      <>
        {cloneElement(children, { ...children.props, ref: mergeRefs([ref, setReferenceElement]) })}
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
            as={components?.popper}
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            {popperContent}
          </StyledPopper>
        </PopperRoot>
      </>
    );
  },
);

Popper.defaultProps = {
  components: undefined,
  cssTransitionProps: undefined,
  popperOptions: undefined,
};

Popper.displayName = 'Popper';

export default Popper;
