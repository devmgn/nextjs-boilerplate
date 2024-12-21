import { type VariantProps, tv } from "tailwind-variants";

const cardVaraints = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-xs",
});

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVaraints> {}

export const Card = ({ className, ...props }: CardProps) => {
  return <div className={cardVaraints(className)} {...props} />;
};
