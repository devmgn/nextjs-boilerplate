import { cloneElement } from 'react';
import styled from 'styled-components';
import Label from '../atoms/Label';
import Text from '../atoms/Text';

const StyledField = styled.div`
  > ${Text}:first-of-type {
    margin-top: 10px;
  }
`;

export type FieldProps = {
  label?: string;
  errorMessage?: string;
  warningMessage?: string;
  children: React.ReactElement;
};

const Field: React.FC<FieldProps> = ({ label, errorMessage, warningMessage, children }) => {
  return (
    <StyledField>
      <Label htmlFor={children.props.id}>{label}</Label>
      {cloneElement(children, {
        isError: Boolean(errorMessage),
        isWarning: Boolean(warningMessage),
      })}
      {errorMessage && <Text>{errorMessage}</Text>}
      {warningMessage && <Text>{warningMessage}</Text>}
    </StyledField>
  );
};

export default Field;
