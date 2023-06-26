'use client';

import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';
import type { TupleToUnion } from 'type-fest';

const VARIANTS = ['title', 'body', 'caption'] as const;

type TypographyProps = {
  variant?: TupleToUnion<typeof VARIANTS>;
};

const Typography = styled.p.withConfig({
  shouldForwardProp: createShouldForwardProp('variant'),
})<TypographyProps>`
  font-size: ${({ variant }) => {
    if (variant === 'title') {
      return '24px';
    }
    if (variant === 'caption') {
      return '10px';
    }
    return '14px';
  }};
  line-height: 1.5;
`;

export default Typography;
