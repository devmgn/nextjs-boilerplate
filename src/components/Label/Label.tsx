import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const labelVariants = tv({
  base: "block w-max text-sm font-medium [[for]]:cursor-pointer [[for]]:has-[+[disabled]]:cursor-auto",
});

interface LabelProps extends React.ComponentProps<"label">, VariantProps<typeof labelVariants> {}

export function Label(props: LabelProps) {
  const { className, ..._props } = props;

  return (
    // oxlint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={labelVariants({ className })} {..._props} />
  );
}
