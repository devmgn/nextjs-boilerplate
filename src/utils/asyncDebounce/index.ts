import { debounce } from "es-toolkit";

type DebounceOptions = {
  signal?: AbortSignal;
  edges?: Array<"leading" | "trailing">;
};

export const asyncDebounce = <T extends unknown[], R>(
  fn: (...args: T) => R | Promise<R>,
  wait: number,
  options?: DebounceOptions,
): ((...args: T) => Promise<R>) => {
  const debounceFn = debounce(
    async (
      resolve: (value: R) => void,
      reject: (reason?: unknown) => void,
      args: T,
    ) => {
      try {
        const result = await fn(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    },
    wait,
    options,
  );

  return (...args: T): Promise<R> =>
    new Promise((resolve, reject) => {
      debounceFn(resolve, reject, args);
    });
};
