import { debounce } from "lodash-es";

export const asyncDebounce = <T extends unknown[], R>(
  fn: (...args: T) => R,
  wait?: Parameters<typeof debounce>[1],
  options?: Parameters<typeof debounce>[2],
) => {
  const debounced = debounce(
    (resolve: (value: R) => void, args: T) => {
      resolve(fn(...args));
    },
    wait,
    options,
  );

  return (...args: T): Promise<R> => {
    return new Promise((resolve) => {
      debounced(resolve, args);
    });
  };
};
