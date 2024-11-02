import type { FlatObject } from "@/types";

/**
 * 対象の列挙型オブジェクトに指定されたキーが存在するかを判定するカスタムタイプガード関数
 * @param {T} obj - チェック対象のオブジェクト
 * @param {PropertyKey} key - 存在を確認するキー
 * @returns {boolean} キーがオブジェクトに存在する場合はtrue、そうでない場合はfalse
 */
export const isKeyOf = <T extends FlatObject>(
  obj: T,
  key: PropertyKey,
): key is keyof T => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
