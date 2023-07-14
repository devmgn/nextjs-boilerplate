'use client';

import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';

type ContainerProps = {
  fullWidth?: boolean;
  maxWidth?: number;
  gutter?: number;
};

const DEFAULT_MAX_WIDTH = 960 as const;
const DEFAULT_GUTTER = 16 as const;

const Container = styled.div.withConfig({
  shouldForwardProp: createShouldForwardProp('fullWidth', 'maxWidth', 'gutter'),
})<ContainerProps>`
  width: ${({ fullWidth, maxWidth, gutter }) => {
    if (fullWidth) {
      return '100%';
    }
    const width = maxWidth ?? DEFAULT_MAX_WIDTH;
    return gutter === undefined
      ? `min(100%, ${width + DEFAULT_GUTTER * 2}px)`
      : `min(100%, ${width + gutter * 2}px)`;
  }};
  padding-right: ${({ gutter }) => (gutter === undefined ? `${DEFAULT_GUTTER}px` : `${gutter}px}`)};
  padding-left: ${({ gutter }) => (gutter === undefined ? `${DEFAULT_GUTTER}px` : `${gutter}px}`)};
  margin-right: auto;
  margin-left: auto;
`;

Container.defaultProps = {
  className: 'Container',
};

export default Container;
