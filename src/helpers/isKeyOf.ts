const isKeyOf = <T extends object>(unionObject: T, key: unknown): key is keyof T => {
  if (typeof key !== 'string') {
    return false;
  }
  return Object.keys(unionObject).includes(key);
};

export default isKeyOf;
