import { useId } from "react";
import { Label } from "../Label";

interface FieldProps extends Omit<React.ComponentProps<"div">, "children"> {
  label?: string;
  errorMessage?: string;
  render: (props: { isError: boolean; id?: string }) => React.ReactNode;
}

/**
 * ラベル、render prop による子入力、エラーメッセージを表示するフォームフィールドラッパー。
 * `label` を省略する場合は、render 内の入力要素に `aria-label` を設定してください。
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
