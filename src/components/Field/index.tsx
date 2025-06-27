import { cloneElement } from "react";
import { Label } from "../Label";

interface FieldProps extends React.ComponentProps<"div"> {
  label?: string;
  errorMessage?: string;
  children: React.ReactElement<{
    id?: string;
    isError?: boolean;
  }>;
}

export const Field = (props: FieldProps) => {
  const { label, errorMessage, children, ...restProps } = props;

  return (
    <div {...restProps}>
      {label && (
        <Label className="mb-2" htmlFor={children.props.id}>
          {label}
        </Label>
      )}
      {cloneElement(children, {
        ...children.props,
        isError: Boolean(errorMessage),
      })}
      {errorMessage && (
        <p className="mt-1 font-normal text-red-500 text-xs">{errorMessage}</p>
      )}
    </div>
  );
};
