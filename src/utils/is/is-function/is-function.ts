// Value-returning functions are assignable to a void-returning type, so void represents "any function".
type AnyFunction = (...args: never[]) => void;

/**
 * Type predicate that checks whether a value is a function.
 * It narrows only the function members of the union `T`,
 * so even when `T` has a form like `value | (() => value)`,
 * the `if` branch narrows to the function and the `else` branch
 * to the non-function side.
 *
 * @typeParam T - The type being checked.
 * @param value - The value to check.
 * @returns `true` if `value` is a function.
 */
export function isFunction<T>(value: T): value is Extract<T, AnyFunction> {
  return typeof value === "function";
}
