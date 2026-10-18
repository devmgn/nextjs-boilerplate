import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const svgIcon = tv({
  base: "size-[1em] shrink-0 fill-current text-current",
  variants: {
    size: {
      xs: "text-icon-xs",
      sm: "text-icon-sm",
      md: "text-icon-md",
      lg: "text-icon-lg",
      xl: "text-icon-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type SvgIconVariants = VariantProps<typeof svgIcon>;

interface SvgIconProps
  extends
    Omit<React.ComponentProps<"svg">, "children" | keyof SvgIconVariants>,
    SvgIconVariants {
  icon: React.ElementType;
  label?: string;
}

/**
 * SVG icon wrapper with size presets and accessible labeling.
 *
 * @param props - The icon component to render, label, size, and SVG attributes.
 * @returns The icon element with styles and ARIA attributes applied.
 */
export function SvgIcon(props: SvgIconProps) {
  const { icon: Icon, label, className, size, ..._props } = props;
  const existsLabel = Boolean(label);

  return (
    <Icon
      aria-hidden={!existsLabel}
      aria-label={label}
      role={existsLabel ? "img" : undefined}
      className={svgIcon({ className, size })}
      focusable={false}
      {..._props}
    />
  );
}
