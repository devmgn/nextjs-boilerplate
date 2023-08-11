import { useCallback, useState } from 'react';
import { useEvent } from '@react-aria/utils';

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

  useEvent(ref, 'compositionstart', handleComposition);
  useEvent(ref, 'compositionupdate', handleComposition);
  useEvent(ref, 'compositionend', handleComposition);

  return isComposing;
};

export default useIsComposing;
