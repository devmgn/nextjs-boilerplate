import { useId } from "react";
import { Label } from "../label";

interface FieldProps extends Omit<React.ComponentProps<"div">, "children"> {
  label?: string;
  errorMessage?: string;
  render: (props: { isError: boolean; id?: string }) => React.ReactNode;
}

/**
 * Form field wrapper that renders a label, a child input via a render prop, and
 * an error message. When omitting `label`, set `aria-label` on the input
 * element inside render.
 *
 * @param props - Label, error message, a render prop that renders the input,
 *   and `div` element attributes.
 * @returns The field element combining the label, input, and error message.
 */
export function Field(props: FieldProps) {
  const id = useId();
  const { label, errorMessage, render, ...restProps } = props;
  const isError = Boolean(errorMessage);
  const existsLabel = Boolean(label);

  return (
    <div {...restProps}>
      {existsLabel && (
        <Label className="mb-2" htmlFor={id}>
          {label}
        </Label>
      )}
      {render({
        isError,
        id: existsLabel ? id : undefined,
      })}
      {isError && (
        <p className="mt-1 text-xs font-normal text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
