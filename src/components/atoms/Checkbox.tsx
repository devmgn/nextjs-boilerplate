import { hideVisually } from 'polished';
import styled from 'styled-components';
import type { InferStyledComponentProps } from '@/@types/InferStyledComponentProps';

const StyledCheckbox = styled.label`
  position: relative;
  display: block;
  width: fit-content;
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
  ${hideVisually()}
  &:checked + ${Label} {
    &::before {
      background-color: #000;
    }
  }
  &:focus-visible + ${Label} {
    outline: -webkit-focus-ring-color auto;
  }
`;

type CheckboxProps = InferStyledComponentProps<typeof Box> & {
  children?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ children, ...props }) => {
  return (
    <StyledCheckbox htmlFor={props.id}>
      <Box type="checkbox" {...props} />
      {children && <Label>{children}</Label>}
    </StyledCheckbox>
  );
};

export default Checkbox;
