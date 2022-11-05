import styled from 'styled-components';
import type { FieldState } from './types';

const StyledSelect = styled.select<FieldState>`
  display: block;
  width: 100%;
  height: 50px;
  padding: 8px 16px;
  font-size: 18px;
  line-height: 32px;
  background-color: #fff;
  border: 1px solid;
  border-color: ${({ $isSuccess, $isError, $isWarning }) => {
    if ($isSuccess) {
      return 'green';
    }
    if ($isError) {
      return 'red';
    }
    if ($isWarning) {
      return 'orange';
    }
    return '#ddd';
  }};
  border-radius: 4px;
`;

type SelectProps = React.ComponentProps<typeof StyledSelect> &
  Record<'options', React.ComponentProps<'option'>[]>;

const Select: React.FC<SelectProps> = ({ options, ...props }) => {
  return (
    <StyledSelect {...props}>
      {options.map((option, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <option key={index} {...option} />
      ))}
    </StyledSelect>
  );
};

export default Select;
