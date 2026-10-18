import { useState } from "react";

type ToggleFn<T> = (next?: T) => void;

/**
 * Value that can be cycled by toggling. The next value is found via `indexOf`
 * equality, so only primitives (which don't depend on reference identity) are
 * allowed.
 */
type ToggleItem = string | number | boolean | bigint | symbol | null;

/**
 * Determines whether the first argument is an array of values to cycle or a
 * boolean initial value.
 *
 * @param value - First argument of `useToggle`
 * @returns `true` if it is an array of values to cycle
 */
function isValueList(
  value: boolean | readonly ToggleItem[] | undefined
): value is readonly ToggleItem[] {
  return Array.isArray(value);
}

/**
 * Custom hook that toggles a boolean or cycles through arbitrary values
 *
 * @example
 *   const [on, toggle] = useToggle(); // boolean
 *   const [theme, toggle] = useToggle(["light", "dark", "system"]);
 *   toggle(); // Next value (inverts if boolean)
 *   toggle("dark"); // Set a specific value
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
