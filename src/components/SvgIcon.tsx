'use client';

import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';

const SvgIcon = styled.svg.withConfig({
  shouldForwardProp: createShouldForwardProp('fontSize', 'color', 'rotate'),
})`
  display: inline-block;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  font-size: ${({ fontSize }) => fontSize || '24px'};
  color: ${({ color }) => color || 'inherit'};
  user-select: none;
  fill: currentColor;
  rotate: ${({ rotate }) => rotate || undefined};
`;

SvgIcon.defaultProps = {
  focusable: false,
  'aria-hidden': true,
};

export default SvgIcon;
