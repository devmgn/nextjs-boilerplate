module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-recess-order'],
  customSyntax: 'postcss-styled-syntax',
  ignoreFiles: ['jest.setup.ts?(x)', '**/*.{test,stories}.tsx'],
};
