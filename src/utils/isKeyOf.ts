export const isKeyOf = <T extends object>(
  unionObject: T,
  key: unknown,
): key is keyof T => {
  if (typeof key !== 'string' && typeof key !== 'number') {
    return false;
  }

  return Object.keys(unionObject).includes(key.toString());
};
