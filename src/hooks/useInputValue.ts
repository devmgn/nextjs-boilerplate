import { useCallback, useState } from 'react';

type UseInputValue = [
  string,
  React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
];

const useInputValue = (initialValue = ''): UseInputValue => {
  const [value, setValue] = useState<UseInputValue[0]>(initialValue);

  const updateValue = useCallback<UseInputValue[1]>(({ target }) => {
    setValue(target.value);
  }, []);

  return [value, updateValue];
};

export default useInputValue;
