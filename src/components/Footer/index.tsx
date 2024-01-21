import { Box } from '@yamada-ui/react';
import type { HTMLUIProps } from '@yamada-ui/react';

export const Footer: React.FC<HTMLUIProps<'footer'>> = (props) => {
  return (
    <Box {...props} as="footer">
      footer
    </Box>
  );
};

Footer.displayName = 'Footer';
