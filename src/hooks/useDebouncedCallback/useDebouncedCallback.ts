import { debounce } from "es-toolkit";
import { useEffect, useMemo } from "react";

export function useDebouncedCallback(...args: Parameters<typeof debounce>) {
  const debouncedFn = useMemo(() => debounce(...args), [args]);

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
