import { useRef } from "react";
import { useDebouncedCallback } from "../use-debounced-callback";

type InputElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Hook that debounces input values and passes them to `onValue`. Intermediate
 * input during IME composition (compositionStart to compositionEnd) is not
 * forwarded; on commit (compositionEnd) it is flushed immediately.
 *
 * Composition state is read from a ref that is accurate at event time (the
 * render snapshot is one step behind inside synchronous events, so it is not
 * used). The return value can be spread directly onto `<input>` /
 * `<textarea>`.
 *
 * @param onValue - Callback that receives the debounced input value
 * @param wait - Debounce delay in milliseconds
 * @returns Event handlers `onChange` / `onCompositionStart` /
 *   `onCompositionEnd`
 */
export function useDebouncedInput(
  onValue: (value: string) => void,
  wait: number
) {
  const debounced = useDebouncedCallback(onValue, wait);
  const isComposingRef = useRef(false);

  return {
    onChange: (e: React.ChangeEvent<InputElement>) => {
      // Don't forward intermediate input during composition to debounce
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
      // Apply immediately when composition is committed
      debounced(e.currentTarget.value);
      debounced.flush();
    },
  };
}
