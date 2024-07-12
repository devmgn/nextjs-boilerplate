import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type { Merge } from "react-hook-form";

const svgIconVariants = cva("size-[1em] fill-current text-current", {
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

interface SvgIconProps
  extends Merge<
    Omit<React.ComponentProps<"svg">, "children">,
    VariantProps<typeof svgIconVariants>
  > {
  component: React.ElementType;
}

export function SvgIcon({
  component: Component,
  className,
  size,
  ...props
}: SvgIconProps) {
  return (
    <Component
      aria-hidden="true"
      className={cn(svgIconVariants({ size, className }))}
      focusable="false"
      {...props}
    />
  );
}
