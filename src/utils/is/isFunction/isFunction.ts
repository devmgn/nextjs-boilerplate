type AnyFunction = (...args: never[]) => unknown;

/**
 * 値が関数かを判定する型述語。ユニオン型 `T` のうち関数成分のみを narrow するので、
 * `T` が `value | (() => value)` のようなフォームでも `if` ブランチで関数、`else` ブランチで
 * 非関数側に narrow される。
 *
 * @template T - 判定対象の型。
 * @param value - 判定対象の値。
 * @returns `value` が関数なら `true`。
 */
export function isFunction<T>(value: T): value is Extract<T, AnyFunction> {
  return typeof value === "function";
}
