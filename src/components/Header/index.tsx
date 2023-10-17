import { Box } from '@radix-ui/themes';
import clsx from 'clsx';
import { header } from './Header.css';
import type { BoxProps } from '@radix-ui/themes/dist/cjs/components/box';

export const Header: React.FC<BoxProps> = ({ className, ...props }) => {
  return (
    <Box {...props} className={clsx(header, className)} asChild>
      <header>header</header>
    </Box>
  );
};
