import type { DebounceOptions } from "es-toolkit";
import { debounce } from "es-toolkit";

export function asyncDebounce<T extends unknown[], R>(
  fn: (...args: T) => R | Promise<R>,
  wait: number,
  options?: DebounceOptions,
): (...args: T) => Promise<R> {
  const pending: Array<{
    resolve: (value: R) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const debouncedFn = debounce(
    async (args: T) => {
      const callbacks = pending.splice(0);

      try {
        const result = await fn(...args);
        for (const { resolve } of callbacks) {
          resolve(result);
        }
      } catch (error) {
        for (const { reject } of callbacks) {
          reject(error);
        }
      }
    },
    wait,
    options,
  );

  return (...args: T): Promise<R> =>
    new Promise((resolve, reject) => {
      pending.push({ resolve, reject });
      debouncedFn(args);
    });
}
