import { useMedia } from 'react-use';

const useMediaQuery = (...[query, defaultState]: Parameters<typeof useMedia>) => {
  const isMatchQuery = useMedia(query.replace('@media ', ''), defaultState);

  return isMatchQuery;
};

export default useMediaQuery;
