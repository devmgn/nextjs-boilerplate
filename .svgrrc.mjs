/**
 * SVGR Configurations
 * @see https://react-svgr.com/docs/options/
 */

export default {
  ref: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: { removeViewBox: false },
        },
      },
    ],
  },
};
