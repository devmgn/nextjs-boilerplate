import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const cardVariants = tv({
  base: "bg-card text-card-foreground rounded-lg border shadow-xs",
});

interface CardProps
  extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

export function Card(props: CardProps) {
  const { className, ..._props } = props;

  return <div className={cardVariants(className)} {..._props} />;
}
