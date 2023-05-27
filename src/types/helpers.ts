/**
 * 交差型のプロパティの展開するためのデバッグ用のユーティリティ型
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;
