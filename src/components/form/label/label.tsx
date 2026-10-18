import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const labelVariants = tv({
  base: "block w-max text-sm font-medium [[for]]:cursor-pointer [[for]]:has-[+[disabled]]:cursor-auto",
});

interface LabelProps
  extends React.ComponentProps<"label">, VariantProps<typeof labelVariants> {}

/**
 * Form label element with consistent typography.
 *
 * @param props - Attributes of the `label` element.
 * @returns The styled `label` element.
 */
export function Label(props: LabelProps) {
  const { className, htmlFor, ..._props } = props;

  return (
    <label
      className={labelVariants({ className })}
      htmlFor={htmlFor}
      {..._props}
    />
  );
}
