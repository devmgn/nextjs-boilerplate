import { Box } from '@radix-ui/themes';
import type { BoxProps } from '@radix-ui/themes/dist/cjs/components/box';

export const Footer: React.FC<BoxProps> = (props) => {
  return (
    <Box {...props} asChild>
      <footer>header</footer>
    </Box>
  );
};
