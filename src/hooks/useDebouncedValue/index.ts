import { debounce } from "lodash-es";
import { useEffect, useState } from "react";
import { useIsComposing } from "../useIsComposing";

/**
 * デバウンスされた値を返すカスタムフック
 */
export const useDebouncedValue = <T>(value: T, wait = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isComposing = useIsComposing();

  const update = debounce((newValue: T) => {
    setDebouncedValue(newValue);
  }, wait);

  useEffect(() => {
    if (isComposing) {
      return;
    }
    update(value);
  }, [isComposing, update, value]);

  return debouncedValue;
};
