import styled from 'styled-components';
import type { InferStyledComponentProps } from '@/types/InferStyledComponentProps';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import Text from '../atoms/Text';

const StyledField = styled.div`
  > ${Input} + ${Text} {
    margin-top: 10px;
  }
`;

export type FieldProps = {
  label?: string;
  errorMessage?: string;
  warningMessage?: string;
  inputProps: InferStyledComponentProps<typeof Input>;
};

const Field: React.FC<FieldProps> = ({ label, inputProps, errorMessage, warningMessage }) => {
  return (
    <StyledField>
      {label ? (
        <>
          <Label htmlFor={inputProps.disabled ? undefined : inputProps.id}>{label}</Label>
          <Input {...inputProps} isError={Boolean(errorMessage)} isWarning={Boolean(warningMessage)} />
        </>
      ) : (
        <label>
          <Input {...inputProps} isError={Boolean(errorMessage)} isWarning={Boolean(warningMessage)} />
        </label>
      )}
      {errorMessage && <Text>{errorMessage}</Text>}
      {warningMessage && <Text>{warningMessage}</Text>}
    </StyledField>
  );
};

export default Field;
