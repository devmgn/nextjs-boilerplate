const isValueOf = <T extends object>(
  unionObject: T,
  value: unknown,
): value is keyof T => {
  return Object.values(unionObject).includes(value);
};

export default isValueOf;
