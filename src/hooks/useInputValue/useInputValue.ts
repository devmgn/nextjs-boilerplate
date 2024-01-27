import { useState } from 'react';

type UseInputValue = [
  NonNullable<
    React.ComponentPropsWithoutRef<'input' | 'textarea' | 'select'>['value']
  >,
  React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
];

export const useInputValue = (
  initialValue: UseInputValue[0] = '',
): UseInputValue => {
  const [value, setValue] = useState<UseInputValue[0]>(initialValue);

  const updateValue = ({
    target,
  }: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setValue(target.value);
  };

  return [value, updateValue];
};
