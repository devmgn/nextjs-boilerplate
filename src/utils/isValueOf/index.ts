export const isValueOf = <T extends object | unknown[]>(
  value: unknown,
  enumObject: T,
): value is keyof T => {
  return Object.values(enumObject).includes(value);
};
