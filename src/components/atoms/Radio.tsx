import { hideVisually } from 'polished';
import styled from 'styled-components';

const StyledRadio = styled.label`
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
    border-radius: 5px;
    transform: translateY(-50%);
  }
`;

const Button = styled.input`
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

type RadioProps = React.ComponentProps<typeof Button> & {
  children?: string;
};

const Radio: React.FC<RadioProps> = ({ children, ...props }) => {
  return (
    <StyledRadio htmlFor={props.id}>
      <Button type="radio" {...props} />
      {children && <Label>{children}</Label>}
    </StyledRadio>
  );
};

export default Radio;
