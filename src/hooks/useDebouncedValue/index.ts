import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useIsComposing } from "../useIsComposing";

/**
 * デバウンスされた値を返すカスタムフック
 */
export const useDebouncedValue = <T>(value: T, wait = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isComposing = useIsComposing();

  const debouncedUpdate = useMemo(
    () => debounce((newValue: T) => setDebouncedValue(newValue), wait),
    [wait],
  );

  useEffect(() => {
    if (!isComposing) {
      debouncedUpdate(value);
    }

    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate, isComposing, value]);

  return debouncedValue;
};
