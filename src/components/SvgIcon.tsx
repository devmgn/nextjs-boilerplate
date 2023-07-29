'use client';

import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';
import type { AnyComponent } from 'styled-components/dist/types';

const StyledSvgIcon = styled.svg.withConfig({
  shouldForwardProp: createShouldForwardProp('fontSize', 'color', 'rotate'),
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

type SvgIconProps = {
  as: AnyComponent;
} & Omit<React.ComponentPropsWithoutRef<typeof StyledSvgIcon>, 'as'>;

const SvgIcon: React.FC<SvgIconProps> = (props) => {
  return <StyledSvgIcon className="SvgIcon" focusable="false" aria-hidden="true" {...props} />;
};

export default SvgIcon;
