import { useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import { useLifecycles } from 'react-use';

const initialState: Omit<DOMRectReadOnly, 'toJSON'> = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const useResizeObserver = <T extends HTMLElement>(
  delay?: Parameters<typeof debounce>[1],
  options?: {
    debounceOptions?: Parameters<typeof debounce>[2];
    observerOptions?: ResizeObserverOptions;
  },
) => {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<typeof initialState>(initialState);
  const { debounceOptions, observerOptions } = options ?? {};

  const update = useCallback(
    (contentRect: DOMRectReadOnly) => {
      if (delay) {
        debounce(() => setRect(contentRect), delay, debounceOptions)();
      } else {
        setRect(contentRect);
      }
    },
    [debounceOptions, delay],
  );

  const observer = useMemo(() => {
    return new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      update(entry.target.getBoundingClientRect());
    });
  }, [update]);

  useLifecycles(
    () => {
      if (ref.current) {
        observer.observe(ref.current, observerOptions);
        setRect(ref.current.getBoundingClientRect());
      }
    },
    () => {
      observer.disconnect();
    },
  );

  return [rect, ref] as const;
};

export default useResizeObserver;
