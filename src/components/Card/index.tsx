import { tv, type VariantProps } from "tailwind-variants";

const cardVaraints = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-xs",
});

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVaraints> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cardVaraints(className)} {...props} />;
}
