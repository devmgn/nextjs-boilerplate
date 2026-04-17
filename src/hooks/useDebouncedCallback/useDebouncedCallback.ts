import type { DebounceOptions } from "../../utils/debounce";
import { useEffect, useMemo } from "react";
import { debounce } from "../../utils/debounce";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
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
