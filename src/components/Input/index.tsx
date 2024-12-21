import { type VariantProps, tv } from "tailwind-variants";

const inputVariants = tv({
  base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
});

interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

export const Input = ({ className, type = "text", ...props }: InputProps) => {
  return <input className={inputVariants(className)} type={type} {...props} />;
};
