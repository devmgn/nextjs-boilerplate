import type { FlatObject, Primitive } from "../../../types/type-helpers";

/**
 * Custom type guard that checks whether the given value exists in the target
 * enum-like object or array
 *
 * @param collection - The object or array to check
 * @param value - The value to look for
 * @returns True if the key exists in the object, false otherwise
 */
export function isValueOf<T extends FlatObject | readonly Primitive[]>(
  collection: T,
  value: unknown
): value is T[keyof T] {
  const values = Array.isArray(collection)
    ? collection
    : Object.values(collection);

  return values.some((v) => v === value);
}
