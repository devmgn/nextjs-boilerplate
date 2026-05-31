import { useEffect, useMemo, useRef } from "react";
import { debounce } from "../../utils/debounce";

/**
 * 最新の `callback` 参照を ref で保持することで、インラインのアロー関数を渡しても
 * 保留中のタイマーが失われないようにする。
 * debounced 関数は `wait` が変化したときだけ再生成される。このとき古い debounced は
 * cleanup の cancel() で破棄されるため、保留中の1回は発火せず捨てられる。
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = useMemo(() => {
    const invokeLatest = (...args: Args) => {
      callbackRef.current(...args);
    };
    // ref は debounce のタイマーから非同期に読まれるだけで、レンダリング中には評価しない
    // oxlint-disable-next-line react-compiler-rules/refs
    return debounce(invokeLatest, wait);
  }, [wait]);

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
