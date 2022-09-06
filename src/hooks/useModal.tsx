import { useState } from 'react';
import Modal from '@/components/ui/Modal';

const useModal = () => {
  const [isActive, setIsActive] = useState(false);

  return {
    Container: ({ children }: { children: React.ReactNode }) => (
      <Modal isActive={isActive} setIsActive={setIsActive}>
        {children}
      </Modal>
    ),
    isActive,
    setIsActive,
  };
};

export default useModal;
