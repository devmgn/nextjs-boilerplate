import type { FlatObject } from "@/types";
import { isKeyOf } from "../isKeyOf";

/**
 * オブジェクトから安全に値を取得する関数
 * 指定されたキーが存在しない場合は undefined を返す
 * この関数は isKeyOf カスタムタイプガード関数を利用しているので取得した値は正確な型が保証される
 *
 * @param {T} obj - 値を取得する対象のオブジェクト
 * @param {K} key - 取得するプロパティのキー
 * @returns {T[K] | undefined} 指定されたキーに対応する値、またはキーが存在しない場合は undefined
 */
export const safeGetValueByKey = <T extends FlatObject, K extends PropertyKey>(
  obj: T,
  key: K,
): T[K] | undefined => {
  return isKeyOf(obj, key) ? obj[key] : undefined;
};
