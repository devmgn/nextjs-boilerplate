import styled from 'styled-components';
import { FieldState } from './types';

const Textarea = styled.textarea<FieldState>`
  display: block;
  width: 100%;
  height: ${({ rows }) => (rows ? rows * 32 + 18 : 50)}px;
  padding: 8px 16px;
  font-size: 18px;
  line-height: 32px;
  background-color: #fff;
  border: 1px solid;
  border-color: ${({ isSuccess, isError, isWarning }) => {
    if (isSuccess) {
      return 'green';
    } else if (isError) {
      return 'red';
    } else if (isWarning) {
      return 'orange';
    }
    return '#ddd';
  }};
  border-radius: 4px;
  &::placeholder {
    color: #ababab;
  }
  &[type='search']::-webkit-search-cancel-button,
  &[type='number']::-webkit-inner-spin-button {
    appearance: none;
  }
`;

export default Textarea;
