/**
 * Utility type that expands an intersection type to make its members explicit
 *
 * Intended for debugging
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

/** Union of JavaScript primitive types */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/** Single-level object whose property values are all primitives */
export type FlatObject = Record<PropertyKey, Primitive>;
