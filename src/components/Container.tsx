'use client';

import styled, { css } from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';

type ContainerProps = {
  fullWidth?: boolean;
  maxWidth?: number;
  gutter?: number;
};

const DEFAULT_MAX_WIDTH = 960 as const;
const DEFAULT_GUTTER = 16 as const;

const Container = styled.div
  .withConfig({
    shouldForwardProp: createShouldForwardProp('fullWidth', 'maxWidth', 'gutter'),
  })
  .attrs({
    className: 'Container',
  })<ContainerProps>(
  ({ fullWidth = false, maxWidth = DEFAULT_MAX_WIDTH, gutter = DEFAULT_GUTTER }) => css`
    width: ${() => (fullWidth ? '100%' : `min(100%, ${maxWidth + gutter * 2}px)`)};
    margin-inline: auto;
    padding-inline: ${() => `${gutter}px`};
  `,
);

export default Container;
