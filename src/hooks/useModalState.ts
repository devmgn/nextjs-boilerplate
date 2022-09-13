import { useCallback, useEffect, useState } from 'react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { StyledModal } from '@/components/ui/Modal';
import { MODAL_TRANSITION_DURATION_IN_MS } from '@/constants';

const useModalState = () => {
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    setIsActive(true);
    disablePageScroll();
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
    window.setTimeout(enablePageScroll, MODAL_TRANSITION_DURATION_IN_MS);
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      const deActivatableElements = [
        document.querySelector(StyledModal),
        ...document.querySelectorAll('[data-modal-deactivate]'),
      ];

      if (event.target instanceof HTMLElement && deActivatableElements.includes(event.target)) {
        deactivate();
      }
    },
    [deactivate]
  );

  useEffect(() => {
    const onEscKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') {
        deactivate();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', onEscKeyDown);
    }
    return () => document.removeEventListener('keydown', onEscKeyDown);
  }, [deactivate, isActive]);

  return { isActive, activate, onClick };
};
export default useModalState;
