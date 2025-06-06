import { tv, type VariantProps } from "tailwind-variants";

const labelVariants = tv({
  base: "block w-max cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

interface LabelProps
  extends React.ComponentProps<"label">,
    VariantProps<typeof labelVariants> {}

export function Label(props: LabelProps) {
  const { className, ...restProps } = props;

  // biome-ignore lint/a11y/noLabelWithoutControl: component does not require a control
  return <label className={labelVariants({ className })} {...restProps} />;
}
