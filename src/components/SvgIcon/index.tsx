import { Box } from '@radix-ui/themes';
import clsx from 'clsx';
import { colorVariant } from '@/config';
import { sizeVariant, svgIcon, themeClass } from './SvgIcon.css';
import type { Theme } from '@/types';
import type { BoxProps } from '@radix-ui/themes/dist/cjs/components/box';
import type { Merge } from 'type-fest';

type SvgIconProps = Merge<
  {
    children: React.ReactElement;
    label: string;
    color?: Theme['color'];
    size?: keyof typeof sizeVariant;
  },
  Omit<BoxProps, 'children' | 'asChild' | 'color'>
>;

export const SvgIcon: React.FC<SvgIconProps> = ({
  label,
  className,
  color = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  return (
    <Box
      {...props}
      aria-hidden="true"
      aria-label={label}
      role="img"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      focusable={false}
      className={clsx(
        className,
        svgIcon,
        colorVariant[color],
        sizeVariant[size],
        themeClass,
      )}
      asChild
    >
      {children}
    </Box>
  );
};
