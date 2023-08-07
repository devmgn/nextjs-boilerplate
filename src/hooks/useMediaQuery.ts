import { useMemo } from 'react';
import { useMedia } from 'react-use';
import { useTheme } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

const useMediaQuery = (
  queryInput: (theme: DefaultTheme) => string | string,
  defaultState?: Parameters<typeof useMedia>[1],
) => {
  const theme = useTheme();

  const query = useMemo(() => {
    const value = typeof queryInput === 'string' ? queryInput : queryInput(theme);
    return value.replace('@media ', '');
  }, [queryInput, theme]);

  return useMedia(query, defaultState);
};

export default useMediaQuery;
