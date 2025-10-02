import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const spinnerVariants = tv({
  slots: {
    base: "inline-block size-[1em] animate-spin",
    circle: "animate-spinner stroke-current",
  },
  variants: {
    color: {
      primary: { base: "text-primary-600" },
    },
    size: {
      xs: { base: "text-[12px]" },
      sm: { base: "text-[24px]" },
      md: { base: "text-[32px]" },
      lg: { base: "text-[48px]" },
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

interface SpinnerProps
  extends Omit<React.ComponentProps<"svg">, "size" | "color">,
    VariantProps<typeof spinnerVariants> {
  open: boolean;
}
const { base, circle } = spinnerVariants();

export function Spinner(props: SpinnerProps) {
  const { className, size, ...restProps } = props;

  const viewBoxSize = 24;
  const svgSize = viewBoxSize / 2;
  const strokeWidth = 2;
  const radius = svgSize - strokeWidth / 2;

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: unnecessary
    <svg
      {...restProps}
      className={base({ className, size })}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
    >
      <circle
        className={circle()}
        cx={svgSize}
        cy={svgSize}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
