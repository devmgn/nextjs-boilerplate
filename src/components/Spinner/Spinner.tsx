import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const spinnerVariants = tv({
  slots: {
    base: "inline-block animate-[spin_1.4s_linear_infinite]",
    circle: "animate-[spinner-circle_1.4s_ease-in-out_infinite] stroke-current",
    track: "stroke-current opacity-15",
  },
  variants: {
    color: {
      primary: { base: "text-primary-600" },
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

const SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

interface SpinnerProps
  extends
    Omit<React.SVGProps<SVGSVGElement>, "size" | "color">,
    VariantProps<typeof spinnerVariants> {
  showTrack?: boolean;
  size?: number | keyof typeof SIZE_MAP;
}
const { base, circle, track } = spinnerVariants();

export function Spinner(props: SpinnerProps) {
  const { className, showTrack = true, size = SIZE_MAP.md, ..._props } = props;

  const finalSize = typeof size === "number" ? size : SIZE_MAP[size];

  return (
    // oxlint-disable-next-line jsx-a11y/svg-has-accessible-name
    <svg
      className={base({ className })}
      height={finalSize}
      viewBox="22 22 44 44"
      width={finalSize}
      {..._props}
    >
      <circle
        className={circle({ className })}
        cx="44"
        cy="44"
        fill="none"
        r="20.2"
        strokeWidth="3.6"
      />
      {Boolean(showTrack) && (
        <circle
          className={track({ className })}
          cx="44"
          cy="44"
          fill="none"
          r="20.2"
          strokeWidth="3.6"
        />
      )}
    </svg>
  );
}
