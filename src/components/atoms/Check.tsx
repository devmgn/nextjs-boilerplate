import { hideVisually } from 'polished';
import styled from 'styled-components';

const Check = styled.label`
  position: relative;
  display: block;
  width: fit-content;
`;

const Label = styled.span`
  padding-left: 16px;
  font-size: 16px;
  line-height: 24px;
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

type CheckboxProps = React.ComponentProps<typeof Box> & {
  children?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ children, ...props }) => {
  return (
    <Check htmlFor={props.id}>
      <Box type="checkbox" {...props} />
      {children && <Label>{children}</Label>}
    </Check>
  );
};

export default Checkbox;
