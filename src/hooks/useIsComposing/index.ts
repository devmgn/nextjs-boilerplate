import { useCallback, useEffect, useState } from "react";

const COMPOSITION_EVENT_NAMES = [
  "compositionstart",
  "compositionupdate",
  "compositionend",
] as const;

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
export const useIsComposing = (): boolean => {
  const [isComposing, setIsComposing] = useState(false);

  const handleComposition = useCallback((event: CompositionEvent) => {
    if (event.target instanceof Element) {
      setIsComposing(event.type !== "compositionend");
    }
  }, []);

  useEffect(() => {
    const { activeElement } = document;
    if (!(activeElement instanceof HTMLElement)) {
      return;
    }

    const addListeners = (element: HTMLElement) => {
      for (const eventName of COMPOSITION_EVENT_NAMES) {
        element.addEventListener(eventName, handleComposition);
      }
    };

    const removeListeners = (element: HTMLElement) => {
      for (const eventName of COMPOSITION_EVENT_NAMES) {
        element.removeEventListener(eventName, handleComposition);
      }
    };

    addListeners(activeElement);

    return () => {
      removeListeners(activeElement);
    };
  }, [handleComposition]);

  return isComposing;
};
