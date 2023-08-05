import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const PopperRoot = styled(CSSTransition).attrs({ className: 'Popper' })<{ timeout: number }>`
  visibility: hidden;
  opacity: 0;
  transition: ${({ theme, timeout }) =>
    theme.transitions.create(['opacity', 'visibility'], { duration: timeout })};
  &.enter,
  &.enter-done {
    visibility: visible;
    opacity: 1;
  }
`;

export default PopperRoot;
