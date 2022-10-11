import styled from 'styled-components';

const StyledDialog = styled.div`
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
    <StyledDialog data-scroll-lock-scrollable>
      <button type="button" data-modal-deactivate>
        閉じる
      </button>
      {children}
    </StyledDialog>
  );
};

export default Dialog;
