import { tv, type VariantProps } from "tailwind-variants";
import type { Merge } from "type-fest";

const svgIcon = tv({
  base: "size-[1em] fill-current text-current",
  variants: {
    size: {
      xs: "text-[12px]",
      sm: "text-[16px]",
      md: "text-[24px]",
      lg: "text-[32px]",
      xl: "text-[40px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type SvgIconVariants = VariantProps<typeof svgIcon>;

interface SvgIconProps
  extends Merge<
    Omit<React.ComponentProps<"svg">, "children">,
    SvgIconVariants
  > {
  icon: React.ElementType;
  label: string;
}

export function SvgIcon({
  icon: Icon,
  label,
  className,
  size,
  ...props
}: SvgIconProps) {
  return (
    <Icon
      aria-hidden="true"
      aria-label={label}
      className={svgIcon({ className, size })}
      focusable="false"
      {...props}
    />
  );
}
