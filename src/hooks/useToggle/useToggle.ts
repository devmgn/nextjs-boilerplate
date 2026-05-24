import { useState } from "react";

type ToggleFn<T> = (next?: T) => void;

/**
 * Boolean または任意の値の循環をトグルするカスタムフック
 *
 * @example
 *   const [on, toggle] = useToggle(); // boolean
 *   const [theme, toggle] = useToggle(["light", "dark", "system"]);
 *   toggle(); // 次の値へ (boolean なら反転)
 *   toggle("dark"); // 特定値へセット
 */
export function useToggle(
  initialValue?: boolean,
): readonly [boolean, ToggleFn<boolean>];
export function useToggle<const T>(
  values: readonly T[],
  initialValue?: T,
): readonly [T, ToggleFn<T>];

export function useToggle(
  valuesOrInitial?: boolean | readonly unknown[],
  initialValue?: unknown,
): readonly [unknown, ToggleFn<never>] {
  const values: readonly unknown[] | null = Array.isArray(valuesOrInitial)
    ? valuesOrInitial
    : null;

  if (values?.length === 0) {
    throw new Error("useToggle: values must be a non-empty array");
  }

  if (
    values !== null &&
    initialValue !== undefined &&
    !values.includes(initialValue)
  ) {
    throw new Error("useToggle: initialValue must be one of the values");
  }

  const initial = values
    ? (initialValue ?? values[0])
    : (valuesOrInitial ?? false);

  const [value, setValue] = useState<unknown>(initial);

  const toggle = (next?: unknown) => {
    if (next !== undefined) {
      setValue(next);
      return;
    }
    setValue((current: unknown) => {
      if (values === null) {
        return current !== true;
      }
      const idx = values.indexOf(current);
      return values[(idx + 1) % values.length];
    });
  };

  return [value, toggle];
}
