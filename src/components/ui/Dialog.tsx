import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { modalContext } from './Modal';

const DialogDiv = styled.div`
  position: relative;
  background-color: #fff;
  width: min(600px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
  padding: 16px;
  @supports (-webkit-touch-callout: none) {
    max-height: calc(100dvh - 32px);
  }

  > button {
    top: 0;
    right: 0;
    position: absolute;
  }
`;

type DialogProps = {
  children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ children }) => {
  const { setIsHidden } = useContext(modalContext);

  const onCloseButtonClick = useCallback(() => {
    setIsHidden(true);
  }, [setIsHidden]);

  return (
    <DialogDiv data-scroll-lock-scrollable>
      <button type="button" onClick={onCloseButtonClick}>
        閉じる
      </button>
      {children}
    </DialogDiv>
  );
};

export default Dialog;
