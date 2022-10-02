import React from 'react';
import styled from 'styled-components';
import type { InferStyledComponentProps } from '@/@types/InferStyledComponentProps';
import type { FormState } from './types';

const StyledSelectBox = styled.select<FormState>`
  display: block;
  width: 100%;
  height: 50px;
  padding: 8px 16px;
  font-size: 18px;
  line-height: 32px;
  background-color: #fff;
  border: 1px solid;
  border-color: ${({ isError, isWarning }) => {
    if (isError) {
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
`;

type SelectBoxProps = InferStyledComponentProps<typeof StyledSelectBox> & {
  options: React.ComponentProps<'option'>[];
};

const SelectBox: React.FC<SelectBoxProps> = ({ options, ...props }) => {
  return (
    <StyledSelectBox {...props}>
      {options.map((option, index) => (
        <option key={index} {...option} />
      ))}
    </StyledSelectBox>
  );
};

export default SelectBox;
