import { cloneElement } from 'react';
import styled from 'styled-components';
import Label from '../atoms/Label';
import Paragraph from '../atoms/Paragraph';

const StyledField = styled.div`
  > ${Paragraph}:first-of-type {
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
      {errorMessage && <Paragraph>{errorMessage}</Paragraph>}
      {warningMessage && <Paragraph>{warningMessage}</Paragraph>}
    </StyledField>
  );
};

export default Field;
