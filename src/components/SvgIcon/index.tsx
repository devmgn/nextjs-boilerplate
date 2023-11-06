import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { svgIcon } from './SvgIcon.css';
import type { SvgIconVariants } from './SvgIcon.css';
import type { SlotProps } from '@radix-ui/react-slot';
import type { Merge } from 'type-fest';

type SvgIconProps = Merge<
  {
    label: string;
    variants: SvgIconVariants;
  },
  Omit<SlotProps, 'color'>
>;

export const SvgIcon: React.FC<SvgIconProps> = ({
  label,
  className,
  variants,
  children,
  ...props
}) => {
  return (
    <Slot
      {...props}
      aria-hidden="true"
      aria-label={label}
      role="img"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      focusable={false}
      className={clsx(className, svgIcon(variants))}
    >
      {children}
    </Slot>
  );
};
