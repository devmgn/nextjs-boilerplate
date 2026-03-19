import { Label } from "../Label";

interface FieldProps extends Omit<React.ComponentProps<"div">, "children"> {
  label?: string;
  errorMessage?: string;
  children: (props: { isError: boolean }) => React.ReactNode;
}

/** ラベル、render prop による子入力、エラーメッセージを表示するフォームフィールドラッパー。 */
export function Field(props: FieldProps) {
  const { label, errorMessage, children, ...restProps } = props;
  const isError = Boolean(errorMessage);

  return (
    <div {...restProps}>
      {Boolean(label) && <Label className="mb-2">{label}</Label>}
      {children({ isError })}
      {isError && (
        <p className="mt-1 text-xs font-normal text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
