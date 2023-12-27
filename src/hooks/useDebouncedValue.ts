import { useCallback, useState } from 'react';
import { useDebounce, useUnmount } from 'react-use';
import { useIsComposing } from './useIsComposing';

/**
 * デバウンスされた値を返すカスタムフック
 */
export const useDebouncedValue = <T>(
  value: T,
  delay: Parameters<typeof useDebounce>[1] = 300,
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isComposing = useIsComposing();

  const update = useCallback(() => {
    if (!isComposing) {
      setDebouncedValue(value);
    }
  }, [isComposing, value]);

  const [, cancel] = useDebounce(update, delay, [update]);

  useUnmount(cancel);

  return debouncedValue;
};
