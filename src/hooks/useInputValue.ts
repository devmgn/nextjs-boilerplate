import { useCallback, useState } from 'react';

type UseInputValue = [
  string,
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
];

const useInputValue = (initialValue?: string): UseInputValue => {
  const [value, setValue] = useState<UseInputValue[0]>(initialValue ?? '');

  const onChange = useCallback<UseInputValue[1]>(({ target }) => {
    setValue(target.value);
  }, []);

  return [value, onChange];
};

export default useInputValue;
