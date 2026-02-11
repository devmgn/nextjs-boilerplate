/**
 * 交差型を展開しそのメンバーを明示的にするユーティリティ型
 * @description デバッグ用途で利用
 * @public
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

/**
 * JavaScriptのプリミティブ型の union
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

/**
 * プリミティブ値のみをプロパティ値に持つ、1階層のオブジェクト
 */
export type FlatObject = Record<PropertyKey, Primitive>;
