import React, { useCallback, useEffect, useState } from 'react';
import { StyledModal } from '@/components/ui/Modal';

const useModalState = () => {
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  const onDeactivate = useCallback<(event: React.MouseEvent) => void>(
    (event) => {
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

  return { isActive, activate, deactivate, onDeactivate };
};

export default useModalState;
