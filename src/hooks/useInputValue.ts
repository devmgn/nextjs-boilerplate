import { useCallback, useState } from 'react';

type UseInputValue = [
  string,
  React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
];

const useInputValue = (initialValue: string): UseInputValue => {
  const [value, setValue] = useState<UseInputValue[0]>(initialValue);

  const onChange = useCallback<UseInputValue[1]>(({ target }) => {
    setValue(target.value);
  }, []);

  return [value, onChange];
};

export default useInputValue;
