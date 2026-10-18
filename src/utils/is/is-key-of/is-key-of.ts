import type { FlatObject } from "../../../types/type-helpers";

/**
 * Custom type guard that checks whether the given key exists in the target
 * enum-like object
 *
 * @param obj - The object to check
 * @param key - The key to look for
 * @returns True if the key exists in the object, false otherwise
 */
export function isKeyOf<T extends FlatObject>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return Object.hasOwn(obj, key);
}
