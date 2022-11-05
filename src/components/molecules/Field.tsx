import { cloneElement } from 'react';
import styled from 'styled-components';
import FieldLabel from '../atoms/FieldLabel';
import Paragraph from '../atoms/Paragraph';
import { FieldState } from '../atoms/types';

const StyledField = styled.div`
  > ${Paragraph}:first-of-type {
    margin-top: 10px;
  }
`;

export type FieldProps = {
  label: string;
  errorMessage?: string;
  warningMessage?: string;
  children: React.ReactElement;
};

const Field: React.FC<FieldProps> = ({ label, errorMessage, warningMessage, children }) => {
  return (
    <StyledField>
      <FieldLabel htmlFor={children.props.id}>{label}</FieldLabel>
      {cloneElement<FieldState>(children, {
        $isError: Boolean(errorMessage),
        $isWarning: Boolean(warningMessage),
      })}
      {errorMessage && <Paragraph>{errorMessage}</Paragraph>}
      {warningMessage && <Paragraph>{warningMessage}</Paragraph>}
    </StyledField>
  );
};

export default Field;
