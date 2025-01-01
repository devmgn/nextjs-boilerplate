import { type VariantProps, tv } from "tailwind-variants";

const labelVariants = tv({
  base: "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

interface LabelProps
  extends React.ComponentProps<"label">,
    VariantProps<typeof labelVariants> {}

export const Label = ({ className, ...props }: LabelProps) => {
  const Component = "label";
  return <Component className={labelVariants(className)} {...props} />;
};