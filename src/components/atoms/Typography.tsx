import styled from '@emotion/styled';
import createShouldForwardProp from '@/helpers/createShouldForwardProp';

type TypographyProps = {
  variant?: 'title' | 'body' | 'caption';
};

const Typography = styled('p', {
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
