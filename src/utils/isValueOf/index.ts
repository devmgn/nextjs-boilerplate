/**
 * 対象の列挙型オブジェクトに指定された値が存在するかを判定するカスタムタイプガード関数
 * @param {T} obj - チェック対象のオブジェクト
 * @param {unknown} value - 存在を確認する値
 * @returns {boolean} キーがオブジェクトに存在する場合はtrue、そうでない場合はfalse
 */
export const isValueOf = <
  T extends Record<Exclude<PropertyKey, "symbol">, unknown>,
>(
  obj: { [K in keyof T]: T[K] },
  value: unknown,
): value is T[keyof T] => {
  const valueSet = new Set(Object.values(obj));
  return valueSet.has(value);
};
