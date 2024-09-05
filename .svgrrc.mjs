/**
 * SVGR Configurations
 * @see https://react-svgr.com/docs/options/
 */

// biome-ignore lint/style/noDefaultExport: <explanation>
export default {
  ref: true,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: { removeViewBox: false },
        },
      },
    ],
  },
};
