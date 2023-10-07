import { Box } from '@radix-ui/themes';
import type { BoxProps } from '@radix-ui/themes/dist/cjs/components/box';

export const Header: React.FC<BoxProps> = (props) => {
  return (
    <Box {...props} asChild>
      <header>header</header>
    </Box>
  );
};
