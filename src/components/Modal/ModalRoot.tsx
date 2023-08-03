import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';
import type { ModalProps } from '.';

const ModalRoot = styled.div.withConfig({
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
    .ModalContainer {
      opacity: 0;
      transition: ${({ theme, transitionDuration }) =>
        theme.transitions.create(['opacity', 'translate'], { duration: transitionDuration })};
      translate: 0 24px;
    }
  }

  &.enter,
  &.enter-done {
    .Backdrop {
      opacity: 1;
    }
    .ModalContainer {
      opacity: 1;
      translate: none;
    }
  }
`;

export default ModalRoot;
