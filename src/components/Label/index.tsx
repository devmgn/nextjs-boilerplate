import { tv, type VariantProps } from "tailwind-variants";

const labelVariants = tv({
  base: "block w-max cursor-pointer font-medium text-sm has-[+[disabled]]:cursor-default",
});

interface LabelProps
  extends React.ComponentProps<"label">,
    VariantProps<typeof labelVariants> {}

export function Label(props: LabelProps) {
  const { className, ...restProps } = props;

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: component does not require a control
    <label className={labelVariants({ className })} {...restProps} />
  );
}
