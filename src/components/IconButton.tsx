'use client';

import styled from 'styled-components';

const IconButton = styled.button.attrs({
  className: 'IconButton',
  type: 'button',
})`
  display: flex;
  flex-shrink: 0;
  padding: 4px;
  margin: -4px;
  border-radius: 50%;
  transition: ${({ theme }) => theme.transitions.create(['background-color'])};
  &:hover {
    background-color: #ddd;
  }
  &:disabled {
    pointer-events: none;
  }
`;

export default IconButton;
