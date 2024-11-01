/**
 * @fileoverview TypeScriptの汎用的なヘルパー型を定義したモジュール
 * @module typeHelpers
 */

/**
 * 交差型のプロパティの展開するためのデバッグ用のユーティリティ型
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

/**
 * オブジェクトのプリミティブ型のプロパティを表す型
 * bigint, symbolは除外
 */
export type PrimitiveValue = string | number | boolean | null | undefined;

/**
 * 1階層のオブジェクトを表す型
 */
export interface ShallowObject {
  [key: PropertyKey]: PrimitiveValue;
}
