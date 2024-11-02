import type { Primitive } from "type-fest";

/**
 * 交差型を展開しそのメンバーを明示的にするユーティリティ型
 * @description デバッグ用途で利用
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

/**
 * プリミティブ値のみをプロパティ値に持つ、1階層のオブジェクト
 */
export type FlatObject = Record<PropertyKey, Primitive>;
