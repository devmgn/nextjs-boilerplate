import { Presence } from "@radix-ui/react-presence";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const backdropVariants = tv({
  base: "fixed inset-0 select-none bg-black/50 data-[state=closed]:animate-[fade-out_0.2s_ease-in-out] data-[state=open]:animate-[fade-in_0.2s_ease-in-out]",
  variants: {
    blur: {
      true: "backdrop-blur-xs",
    },
  },
  defaultVariants: {
    blur: true,
  },
});

interface BackdropProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof backdropVariants> {
  open: boolean;
}

export function Backdrop(props: BackdropProps) {
  const { open, blur, className, ...restProps } = props;

  return (
    <Presence present={open}>
      <div
        {...restProps}
        aria-hidden="true"
        className={backdropVariants({ className, blur })}
        data-state={open ? "open" : "closed"}
        role="presentation"
      />
    </Presence>
  );
}
