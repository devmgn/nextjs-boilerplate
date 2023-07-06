import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import useIsComposing from './useIsComposing';

/**
 * デバウンスされた値を返すカスタムフック
 * @param {T} value - 入力値
 * @param {number} delay - バウンスの遅延時間(ms)
 * @param {Parameters<typeof useIsComposing>[0]} ref
 * @returns {T}
 */
const useDebouncedValue = <T>(
  value: T,
  delay: number,
  ref: Parameters<typeof useIsComposing>[0],
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isComposing = useIsComposing(ref);

  const update = () => {
    if (!isComposing) {
      setDebouncedValue(value);
    }
  };

  const [isReady, cancel] = useDebounce(update, delay, [update]);

  useEffect(() => {
    if (isReady()) {
      setDebouncedValue(value);
    }
    return cancel;
  }, [cancel, isReady, value]);

  return debouncedValue;
};

export default useDebouncedValue;
