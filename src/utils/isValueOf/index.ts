import type { PrimitiveValue, ShallowObject } from "@/types";

/**
 * 対象の列挙型オブジェクトもしくは配列に指定された値が存在するかを判定するカスタムタイプガード関数
 * @param {T} collection - チェック対象のオブジェクトもしくは配列
 * @param {unknown} value - 存在を確認する値
 * @returns {boolean} キーがオブジェクトに存在する場合はtrue、そうでない場合はfalse
 */
export const isValueOf = <T extends ShallowObject | readonly PrimitiveValue[]>(
  collection: T,
  value: unknown,
): value is T[keyof T] => {
  const values = Array.isArray(collection)
    ? collection
    : Object.values(collection);
  return values.some((v) => v === value);
};
