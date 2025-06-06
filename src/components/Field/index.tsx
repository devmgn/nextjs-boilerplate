import { cloneElement } from "react";
import { tv } from "tailwind-variants";
import { Label } from "../Label";

const fieldVariants = tv({
  slots: {
    base: "",
    label: "mb-2",
    errorMessage: "mt-1 font-normal text-red-500 text-xs",
  },
});

interface FieldProps extends React.ComponentProps<"div"> {
  label: string;
  errorMessage?: string;
  children: React.ReactElement<{
    id?: string;
    isError?: boolean;
  }>;
}

export const Field = (props: FieldProps) => {
  const { label, errorMessage, children, className, ...restProps } = props;

  return (
    <div className={fieldVariants().base({ className })} {...restProps}>
      {label && (
        <Label className={fieldVariants().label()} htmlFor={children.props.id}>
          {label}
        </Label>
      )}
      {cloneElement(children, { ...children.props, isError: !!errorMessage })}
      {errorMessage && (
        <p className={fieldVariants().errorMessage()}>{errorMessage}</p>
      )}
    </div>
  );
};
