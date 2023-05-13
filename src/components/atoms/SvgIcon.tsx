import styled from '@emotion/styled';
import createShouldForwardProp from '@/helpers/createShouldForwardProp';
import type { CSSProperties } from 'react';

type SvgIconProps = {
  fontSize?: CSSProperties['fontSize'];
  rotate?: CSSProperties['rotate'];
  color?: CSSProperties['color'];
};

const SvgIcon = styled('svg', {
  shouldForwardProp: createShouldForwardProp('fontSize', 'rotate', 'color'),
})<SvgIconProps>`
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
