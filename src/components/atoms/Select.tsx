import styled from 'styled-components';
import { InferStyledComponentProps } from '@/@types/InferStyledComponentProps';
import type { FormState } from './types';

const StyledSelect = styled.select<FormState>`
  display: block;
  width: 100%;
  height: 50px;
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
`;

type SelectProps = InferStyledComponentProps<typeof StyledSelect> & Record<'options', React.ComponentProps<'option'>[]>;

const Select: React.FC<SelectProps> = ({ options, ...props }) => {
  return (
    <StyledSelect {...props}>
      {options.map((option, index) => (
        <option key={index} {...option} />
      ))}
    </StyledSelect>
  );
};

export default Select;
