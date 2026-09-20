import { useState } from "react";

type ToggleFn<T> = (next?: T) => void;

/**
 * トグルで循環させられる値。次の値の決定に `indexOf` の同値比較を使うため、
 * 参照同一性に依存しないプリミティブに限る。
 */
type ToggleItem = string | number | boolean | bigint | symbol | null;

/** 第 1 引数が「循環させる値の配列」か「boolean の初期値」かを判定する。 */
function isValueList(
  value: boolean | readonly ToggleItem[] | undefined
): value is readonly ToggleItem[] {
  return Array.isArray(value);
}

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
  initialValue?: boolean
): readonly [boolean, ToggleFn<boolean>];
export function useToggle<const T extends ToggleItem>(
  values: readonly T[],
  initialValue?: T
): readonly [T, ToggleFn<T>];

export function useToggle(
  valuesOrInitial?: boolean | readonly ToggleItem[],
  initialValue?: ToggleItem
): readonly [ToggleItem, ToggleFn<never>] {
  const values: readonly ToggleItem[] | null = isValueList(valuesOrInitial)
    ? valuesOrInitial
    : null;
  const booleanInitial: ToggleItem = isValueList(valuesOrInitial)
    ? false
    : (valuesOrInitial ?? false);

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

  const initial: ToggleItem = values
    ? (initialValue ?? values[0] ?? false)
    : booleanInitial;

  const [value, setValue] = useState<ToggleItem>(initial);

  const toggle = (next?: ToggleItem) => {
    if (next !== undefined) {
      setValue(next);
      return;
    }
    setValue((current: ToggleItem) => {
      if (values === null) {
        return current !== true;
      }
      const idx = values.indexOf(current);
      return values[(idx + 1) % values.length];
    });
  };

  return [value, toggle];
}
