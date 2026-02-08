import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const inputVariants = tv({
  base: "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    isError: {
      true: "text-red-600",
    },
  },
  defaultVariants: {
    isError: false,
  },
});

interface InputProps extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {}

export function Input(props: InputProps) {
  const { className, isError, ..._props } = props;

  return <input className={inputVariants({ className, isError })} {..._props} />;
}
