import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const cardVariants = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-xs",
});

interface CardProps
  extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

/**
 * Container with rounded corners, a border, and a shadow, for grouping related
 * content.
 *
 * @param props - Attributes of the `div` element.
 * @returns The styled card element.
 */
export function Card(props: CardProps) {
  const { className, ..._props } = props;

  return <div className={cardVariants(className)} {..._props} />;
}
