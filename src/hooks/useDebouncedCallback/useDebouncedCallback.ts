import type { DebounceOptions } from "../../utils/debounce";
import { useEffect, useMemo } from "react";
import { debounce } from "../../utils/debounce";

/**
 * `callback` と `options` は安定参照で渡すこと。毎レンダーで新しい参照を渡すと
 * `useMemo` が再計算され、保留中のタイマーと leading クールダウン状態が失われる。
 * `options` が静的な場合はコンポーネント外か `useMemo` で固定する。
 */
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
