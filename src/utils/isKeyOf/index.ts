/**
 * 指定されたキーが対象オブジェクト（通常は列挙型）のプロパティであるかを判定するカスタムタイプガード関数
 */
export const isKeyOf = <T extends object>(
  key: unknown,
  enumObject: T,
): key is keyof T => {
  return Object.prototype.hasOwnProperty.call(enumObject, String(key));
};
