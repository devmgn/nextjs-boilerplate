/**
 * Postcss Configuration
 * @see https://postcss.org
 */

export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': false,
      },
      autoprefixer: {},
    },
  },
};
