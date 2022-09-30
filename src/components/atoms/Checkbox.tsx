import styled from 'styled-components';
import type { InferStyledComponentProps } from '@/@types/InferStyledComponentProps';

const StyledCheckbox = styled.label`
  position: relative;
  display: block;
  cursor: pointer;
`;

const Label = styled.span`
  padding-left: 16px;
  font-size: 16px;
  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 10px;
    height: 10px;
    content: '';
    border: 1px solid #000;
    transform: translateY(-50%);
  }
`;

const Box = styled.input`
  opacity: 1;
  &:checked + ${Label} {
    &::before {
      background-color: #000;
    }
  }
`;

type CheckboxProps = InferStyledComponentProps<typeof Box> & {
  children?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ children, ...checkboxProps }) => {
  return (
    <StyledCheckbox htmlFor={checkboxProps.id}>
      <Box type="checkbox" {...checkboxProps} />
      {children && <Label>{children}</Label>}
    </StyledCheckbox>
  );
};

export default Checkbox;
