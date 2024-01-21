import { Box } from '@yamada-ui/react';
import type { HTMLUIProps } from '@yamada-ui/react';

export const Header: React.FC<HTMLUIProps<'header'>> = (props) => {
  return (
    <Box {...props} as="header">
      header
    </Box>
  );
};

Header.displayName = 'Header';
