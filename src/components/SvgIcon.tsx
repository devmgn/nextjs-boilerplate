import styled from '@emotion/styled';
import createShouldForwardProp from '@/utils/createShouldForwardProp';

const SvgIcon = styled('svg', {
  shouldForwardProp: createShouldForwardProp('fontSize', 'rotate', 'color'),
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
