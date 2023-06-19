import { useCallback, useState } from 'react';

const useInputValue = (initialValue?: string) => {
  const [value, setValue] = useState(initialValue ?? '');

  const onChange = useCallback(
    ({
      currentTarget,
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(currentTarget.value);
    },
    []
  );

  return {
    value,
    onChange,
  };
};

export default useInputValue;
