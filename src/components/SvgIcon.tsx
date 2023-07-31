import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';

const SvgIcon = styled.svg
  .withConfig({
    shouldForwardProp: createShouldForwardProp('fontSize', 'color', 'rotate'),
  })
  .attrs({
    className: 'SvgIcon',
    focusable: false,
    'aria-hidden': true,
  })`
  display: inline-block;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '24px')};
  color: ${({ color }) => color ?? 'inherit'};
  user-select: none;
  fill: currentColor;
  rotate: ${({ rotate }) => (rotate ? `${rotate}deg` : undefined)};
`;

export default SvgIcon;
