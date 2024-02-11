module.exports = {
  root: true,
  env: {
    'jest/globals': true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'next/core-web-vitals',
    'prettier',
  ],
  plugins: ['@tanstack/query'],
  rules: {
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration:not([const=true])',
        message: "Don't declare non-const enums",
      },
    ],
    'lines-between-class-members': 'off',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: '{react,react/**}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '{react-dom,react-dom/**}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '{next,next/**}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],
        'newlines-between': 'never',
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: ['builtin', 'object', 'type'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          '^use(Async|AsyncFn|AsyncRetry|UpdateEffect|IsomorphicLayoutEffect|DeepCompareEffect|ShallowCompareEffect)$',
      },
    ],
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: ['interface', 'typeAlias', 'class'],
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
      },
    },
    {
      files: ['**/?(*.)+(stories).[tj]s?(x)'],
      extends: ['plugin:storybook/recommended'],
      rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react/jsx-pascal-case': ['error', { allowNamespace: true }],
      },
    },
    {
      files: ['**/?(*.)+(spec|test).[tj]s?(x)', 'jest.setup.js?(x)'],
      extends: ['plugin:jest/recommended'],
    },
    {
      files: ['**/mocks/**/*.[tj]s?(x)'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
