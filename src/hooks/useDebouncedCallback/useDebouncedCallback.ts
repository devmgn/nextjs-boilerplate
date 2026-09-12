import { useEffect, useState } from "react";
import { debounce } from "../../utils/debounce";

/**
 * 最新の `callback` を抱えた debounce インスタンス。
 *
 * 生きた `setTimeout` を握るため、識別子が変わると保留中の1回が黙って失われる。
 * 状態を React の外側（ただのクロージャ）に閉じ込めることで、識別子の安定を
 * メモ化の有無に依存させない。`wait` は生成時に固定する。
 */
function createDebouncedRunner<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
) {
  let latestCallback = callback;

  // 引数はタプルのまま1つの値として渡す。こうすると debounce 側は
  // 「最新の引数を1件だけ保持する」という本来の役割だけを担う。
  const debounced = debounce((args: Args) => {
    latestCallback(...args);
  }, wait);

  function invoke(...args: Args) {
    debounced(args);
  }
  invoke.cancel = debounced.cancel;
  invoke.flush = debounced.flush;

  return {
    wait,
    invoke,
    cancel: debounced.cancel,
    setCallback(next: (...args: Args) => void) {
      latestCallback = next;
    },
  };
}

/**
 * `callback` を debounce して返すフック。インラインのアロー関数を毎レンダリング渡しても
 * 保留中のタイマーは失われず、発火時には「その時点で最新の `callback`」が呼ばれる。
 * `wait` が変化したときだけ作り直され、古い方の保留中の1回は cleanup で破棄される。
 *
 * インスタンスは `useState` の遅延初期化で保持する。初期化関数が一度しか実行されない
 * ことは React の仕様で保証されているため、識別子の安定がメモ化の有無に依存しない
 * （`useMemo` や React Compiler の自動メモ化は最適化であって保証ではない）。
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
) {
  const [runner, setRunner] = useState(() =>
    createDebouncedRunner(callback, wait),
  );

  // wait 変化時の作り直し。React の「props の変化に応じて state を調整する」パターン。
  if (runner.wait !== wait) {
    setRunner(createDebouncedRunner(callback, wait));
  }

  useEffect(() => {
    runner.setCallback(callback);
  }, [callback, runner]);

  useEffect(() => {
    return () => {
      runner.cancel();
    };
  }, [runner]);

  return runner.invoke;
}
