import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const inputVariants = tv({
  base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    isError: {
      true: "text-destructive",
    },
  },
  defaultVariants: {
    isError: false,
  },
});

interface InputProps
  extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {}

/** エラー状態をサポートするスタイル付きテキスト入力。 */
export function Input(props: InputProps) {
  const { className, isError, ..._props } = props;

  return (
    <input className={inputVariants({ className, isError })} {..._props} />
  );
}
