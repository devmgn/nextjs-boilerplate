import { useRef } from "react";
import { useDebouncedCallback } from "../useDebouncedCallback";

type InputElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * 入力値を debounce して `onValue` に渡すフック。IME 変換中 (compositionStart〜End) の
 * 中間入力は流さず、変換確定時 (compositionEnd) に flush で即時反映する。
 *
 * 変換状態はイベント時刻に正確な ref で判定する（render スナップショットは同期イベント内で
 * 1 テンポ古いため使わない）。返り値は `<input>` / `<textarea>` にそのままスプレッドできる。
 */
export function useDebouncedInput(
  onValue: (value: string) => void,
  wait: number,
) {
  const debounced = useDebouncedCallback(onValue, wait);
  const isComposingRef = useRef(false);

  return {
    onChange: (e: React.ChangeEvent<InputElement>) => {
      // 変換中の中間入力は debounce に流さない
      if (isComposingRef.current) {
        return;
      }
      debounced(e.target.value);
    },
    onCompositionStart: () => {
      isComposingRef.current = true;
    },
    onCompositionEnd: (e: React.CompositionEvent<InputElement>) => {
      isComposingRef.current = false;
      // 変換確定時は即時反映する
      debounced(e.currentTarget.value);
      debounced.flush();
    },
  };
}
