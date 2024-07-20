import { type VariantProps, tv } from "tailwind-variants";
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
  component: React.ElementType;
}

export function SvgIcon({ component: Tag, ...props }: SvgIconProps) {
  return (
    <Tag
      aria-hidden="true"
      className={svgIcon(props)}
      focusable="false"
      {...props}
    />
  );
}
