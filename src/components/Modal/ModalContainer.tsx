import styled from 'styled-components';

const ModalContainer = styled.div.attrs({ className: 'ModalContainer' })`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  pointer-events: none;
  outline: none;
  > * {
    pointer-events: auto;
  }
`;

export default ModalContainer;
