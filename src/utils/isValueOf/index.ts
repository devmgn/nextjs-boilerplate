/**
 * 指定された値が対象オブジェクトの値の1つであるかを判定するカスタムタイプガード関数
 */
export const isValueOf = <T extends object>(
  value: unknown,
  enumObject: { [K in keyof T]: T[K] },
): value is T[keyof T] => {
  const valueSet = new Set(Object.values(enumObject));
  return valueSet.has(value);
};
