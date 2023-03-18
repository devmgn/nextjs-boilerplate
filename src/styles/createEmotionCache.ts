import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: false });
};

export default createEmotionCache;
