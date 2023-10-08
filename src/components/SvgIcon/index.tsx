import { Box } from '@radix-ui/themes';
import clsx from 'clsx';
import { svgIcon } from './SvgIcon.css';
import type { BoxProps } from '@radix-ui/themes/dist/cjs/components/box';
import type { Merge } from 'type-fest';

type SvgIconProps = Merge<
  {
    children: React.ReactElement;
    label: string;
  },
  Omit<BoxProps, 'children' | 'asChild'>
>;

export const SvgIcon: React.FC<SvgIconProps> = ({
  label,
  className,
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
      className={clsx(svgIcon, className)}
      asChild
    >
      {children}
    </Box>
  );
};
