import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-xs",
});

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

export function Card(props: CardProps) {
  const { className, ...restProps } = props;

  return <div className={cardVariants(className)} {...restProps} />;
}
