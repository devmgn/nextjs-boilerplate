export const isKeyOf = <T extends object>(
  key: unknown,
  enumObject: T,
): key is keyof T => {
  if (typeof key !== 'string' && typeof key !== 'number') {
    return false;
  }

  return Object.keys(enumObject).includes(key.toString());
};
