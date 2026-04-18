import type { DebounceOptions } from "../../utils/debounce";
import { useEffect, useMemo, useRef } from "react";
import { debounce } from "../../utils/debounce";

/**
 * 最新の `callback` 参照を ref で保持することで、インラインのアロー関数を渡しても
 * 保留中のタイマー・leading クールダウン状態が失われないようにする。
 * debounced 関数は `wait`/`edges`/`signal`/`maxWait` が変化したときだけ再生成される。
 * `edges` は boolean 正規化しているため `undefined` と `["trailing"]`、
 * `["leading","trailing"]` と `["trailing","leading"]` はそれぞれ同じ扱いになる。
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
  options?: DebounceOptions,
) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const rawEdges = options?.edges;
  // debounce 側 default (["trailing"]) と整合させる
  const hasLeading = rawEdges?.includes("leading") ?? false;
  const hasTrailing = rawEdges?.includes("trailing") ?? true;
  const signal = options?.signal;
  const maxWait = options?.maxWait;

  const debouncedFn = useMemo(() => {
    const invokeLatest = (...args: Args) => {
      callbackRef.current(...args);
    };
    const edges: Array<"leading" | "trailing"> = [];
    if (hasLeading) {
      edges.push("leading");
    }
    if (hasTrailing) {
      edges.push("trailing");
    }
    // ref は debounce のタイマーから非同期に読まれるだけで、レンダリング中には評価しない
    // oxlint-disable-next-line react-compiler-rules/refs
    return debounce(invokeLatest, wait, { edges, signal, maxWait });
  }, [hasLeading, hasTrailing, maxWait, signal, wait]);

  useEffect(() => {
    return () => {
      debouncedFn.dispose();
    };
  }, [debouncedFn]);

  return debouncedFn;
}
