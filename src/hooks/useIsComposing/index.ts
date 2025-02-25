import { useCallback, useEffect, useRef, useState } from "react";

const COMPOSITION_EVENT_NAMES = [
  "compositionstart",
  "compositionupdate",
  "compositionend",
] as const satisfies (keyof HTMLElementEventMap)[];

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
export const useIsComposing = (): boolean => {
  const [isComposing, setIsComposing] = useState(false);
  const activeElementRef = useRef<HTMLElement | null>(null);

  const handleComposition = useCallback((event: CompositionEvent) => {
    setIsComposing(event.type !== "compositionend");
  }, []);

  const removeListeners = useCallback(() => {
    const { current: activeElement } = activeElementRef;
    if (activeElement === null) {
      return;
    }
    COMPOSITION_EVENT_NAMES.forEach((eventName) => {
      activeElement.removeEventListener(eventName, handleComposition);
    });
  }, [handleComposition]);

  const updateListeners = useCallback(() => {
    removeListeners();

    const { activeElement } = document;
    if (activeElement instanceof HTMLElement) {
      activeElementRef.current = activeElement;
      for (const eventName of COMPOSITION_EVENT_NAMES) {
        activeElement.addEventListener(eventName, handleComposition);
      }
    } else {
      activeElementRef.current = null;
    }
  }, [removeListeners, handleComposition]);

  useEffect(() => {
    updateListeners();
    document.addEventListener("focusin", updateListeners);

    return () => {
      document.removeEventListener("focusin", updateListeners);
      removeListeners();
    };
  }, [updateListeners, removeListeners]);

  return isComposing;
};
