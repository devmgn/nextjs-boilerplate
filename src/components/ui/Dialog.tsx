import styled from 'styled-components';

const StyledDialog = styled.div`
  width: min(300px, 100%);
  max-height: calc(100vh - 32px);
  padding: 16px;
  background-color: #fff;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  @supports (-webkit-touch-callout: none) {
    max-height: calc(100dvh - 32px);
  }
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
