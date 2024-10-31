import { useCallback, useEffect, useState } from "react";

const COMPOSITION_EVENT_NAMES = [
  "compositionstart",
  "compositionupdate",
  "compositionend",
] as const satisfies (keyof HTMLElementEventMap)[];

type CompositionEventName = (typeof COMPOSITION_EVENT_NAMES)[number];

/**
 * テキストの編集中にユーザーがテキストの作成中かどうかを判定するカスタムフック
 */
export const useIsComposing = (): boolean => {
  const [isComposing, setIsComposing] = useState(false);

  const handleComposition = useCallback((event: CompositionEvent) => {
    setIsComposing(event.type !== "compositionend");
  }, []);

  useEffect(() => {
    const { activeElement } = document;
    if (!(activeElement instanceof HTMLElement)) {
      return;
    }
    const addListener = (eventName: CompositionEventName) =>
      activeElement.addEventListener(eventName, handleComposition);

    const removeListener = (eventName: CompositionEventName) =>
      activeElement.removeEventListener(eventName, handleComposition);

    for (const eventName of COMPOSITION_EVENT_NAMES) {
      addListener(eventName);
    }

    return () => {
      for (const eventName of COMPOSITION_EVENT_NAMES) {
        removeListener(eventName);
      }
    };
  }, [handleComposition]);

  return isComposing;
};
