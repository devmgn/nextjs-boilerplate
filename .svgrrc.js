/**
 * SVGR Configurations
 * @see https://react-svgr.com/docs/options/
 */

module.exports = {
  // @see https://github.com/svg/svgo#configuration
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
};
