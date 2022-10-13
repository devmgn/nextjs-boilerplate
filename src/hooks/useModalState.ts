import { useCallback, useEffect, useState } from 'react';
import { StyledModal } from '@/components/molecules/Modal';

type UseModalOptions = {
  onActivate?: () => void;
  onDeactivate?: () => void;
};

const useModalState = ({ onActivate, onDeactivate }: UseModalOptions = {}) => {
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    setIsActive(true);
    if (onActivate) {
      onActivate();
    }
  }, [onActivate]);

  const deactivate = useCallback(() => {
    setIsActive(false);
    if (onDeactivate) {
      onDeactivate();
    }
  }, [onDeactivate]);

  const handleDeactivate = useCallback<(event: React.MouseEvent) => void>(
    (event) => {
      const deactivateTriggerElements = [
        document.querySelector(StyledModal),
        ...document.querySelectorAll('[data-modal-deactivate]'),
      ];

      if (event.target instanceof HTMLElement && deactivateTriggerElements.includes(event.target)) {
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

  return { isActive, activate, deactivate, handleDeactivate };
};

export default useModalState;
