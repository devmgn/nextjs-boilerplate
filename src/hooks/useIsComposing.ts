import { useCallback, useEffect, useState } from 'react';

/**
 * IMEの入力中かどうかを返すカスタムフック
 *
 * @param {React.RefObject<HTMLElement>} ref - 監視する要素
 * @returns {boolean}
 */
const useIsComposing = (ref: React.RefObject<HTMLElement>): boolean => {
  const [isComposing, setIsComposing] = useState(false);

  const handleComposition = useCallback((event: Event) => {
    setIsComposing(event.type !== 'compositionend');
  }, []);

  useEffect(() => {
    const { current: element } = ref;
    if (!element) {
      return undefined;
    }
    const compositionEventNames = ['compositionstart', 'compositionupdate', 'compositionend'];

    compositionEventNames.forEach((eventName) =>
      element.addEventListener(eventName, handleComposition),
    );
    return () => {
      compositionEventNames.forEach((eventName) =>
        element.removeEventListener(eventName, handleComposition),
      );
    };
  }, [handleComposition, ref]);

  return isComposing;
};

export default useIsComposing;
