import { useState, useCallback, useEffect } from 'react';

const useModalState = () => {
  const [isActive, setIsActive] = useState(false);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleDeactivate = useCallback<(event: React.MouseEvent) => void>(
    (event) => {
      const deactivateTriggerElements = Array.from(
        document.querySelectorAll('[data-modal-deactivate]')
      );

      if (event.target instanceof Element && deactivateTriggerElements.includes(event.target)) {
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
