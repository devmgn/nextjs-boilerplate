import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { Merge } from 'type-fest';

const svgIconVariants = cva('size-[1em] fill-current text-current', {
  variants: {
    size: {
      xs: 'text-[12px]',
      sm: 'text-[16px]',
      md: 'text-[24px]',
      lg: 'text-[32px]',
      xl: 'text-[40px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type SvgIconProps = Merge<
  { component: React.ElementType },
  Omit<React.HTMLAttributes<SVGSVGElement>, 'children'> &
    VariantProps<typeof svgIconVariants>
>;

export const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  ({ component: Component, className, size, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        aria-hidden="true"
        className={cn(svgIconVariants({ size, className }))}
        focusable="false"
        {...props}
      />
    );
  },
);

SvgIcon.displayName = 'SvgIcon';
