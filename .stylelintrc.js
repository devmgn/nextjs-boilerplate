module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-recess-order'],
  plugins: ['stylelint-no-unsupported-browser-features', 'stylelint-prettier'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    'prettier/prettier': true,
    'function-name-case': null,
    'function-no-unknown': null,
    'annotation-no-unknown': null,
    'value-keyword-case': null,
    'selector-type-case': 'lower',
    'length-zero-no-unit': true,
    'function-url-quotes': 'never',
    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'selector-not-notation': 'complex',
    'selector-pseudo-element-colon-notation': 'double',
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
      },
    ],
  },
  ignoreFiles: [
    'src/jest.setup.{ts,tsx}',
    'src/**/*.{test,stories,types}.{ts,tsx}',
    'src/**/{types,states,api}/**/*',
  ],
};
