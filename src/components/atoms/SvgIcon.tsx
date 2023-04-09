import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

const SvgIcon = styled('svg', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['fontSize', 'color', 'rotate'].includes(prop),
})`
  display: inline-block;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  font-size: ${({ fontSize }) =>
    typeof fontSize === 'number' ? `${fontSize}px` : fontSize || '24px'};
  color: ${({ color }) => color || undefined};
  user-select: none;
  fill: currentColor;
  rotate: ${({ rotate }) => (typeof rotate === 'number' ? `${rotate}deg` : rotate)};
`;

SvgIcon.defaultProps = {
  width: undefined,
  height: undefined,
  focusable: false,
  'aria-hidden': false,
};

export default SvgIcon;
