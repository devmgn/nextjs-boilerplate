import type { DebounceOptions } from "es-toolkit";
import { debounce } from "es-toolkit";
import { useEffect, useMemo } from "react";

//
export function useDebouncedCallback<F extends (...args: any[]) => void>(
  callback: F,
  wait: number,
  options?: DebounceOptions,
) {
  const debouncedFn = useMemo(
    () => debounce(callback, wait, options),
    [callback, options, wait],
  );

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
