import styled, { css } from 'styled-components';
import { FormState } from './types';

const Textarea = styled.textarea<FormState>`
  display: block;
  width: 100%;
  height: ${({ rows }) => (rows ? rows * 32 + 18 : 50)}px;
  padding: 8px 16px;
  font-size: 18px;
  line-height: 32px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  &::placeholder {
    color: #ababab;
  }
  &[type='search']::-webkit-search-cancel-button,
  &[type='number']::-webkit-inner-spin-button {
    appearance: none;
  }
  ${({ isError }) =>
    isError &&
    css`
      border-color: red !important;
    `}
  ${({ isWarning }) =>
    isWarning &&
    css`
      border-color: orange;
    `}
`;

export default Textarea;
