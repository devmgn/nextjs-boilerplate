/**
 * 交差型のプロパティの展開するためのデバッグ用のユーティリティ型
 */
export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

export type EnumObjKeys<T extends object> = keyof T;
export type EnumObjValues<T extends object> = T[keyof T];
