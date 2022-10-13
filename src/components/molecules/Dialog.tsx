import { m } from 'framer-motion';
import styled from 'styled-components';
import { TRANSITION } from '@/constants';

const StyledDialog = styled(m.div)`
  width: min(300px, 100%);
  max-height: fill-available;
  overflow: auto;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
`;

type DialogProps = {
  children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ children }) => {
  return (
    <StyledDialog
      key="modal-backdrop"
      initial="inactive"
      animate="active"
      exit="inactive"
      variants={{
        active: { y: 0 },
        inactive: { y: '100vh' },
      }}
      transition={TRANSITION}
      data-scroll-lock-scrollable
    >
      <button type="button" data-modal-deactivate>
        閉じる
      </button>
      {children}
    </StyledDialog>
  );
};

export default Dialog;
