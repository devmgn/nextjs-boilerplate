module.exports = {
  env: {
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'next',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'arrow-body-style': 'off',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'typeAlias',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'interface',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'class',
        format: ['StrictPascalCase'],
      },
    ],
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
            pattern: 'react',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/jest.setup.{ts,tsx}', '**/*.{test,spec,stories}.{ts,tsx}'],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
  },
  overrides: [
    {
      extends: ['plugin:storybook/recommended'],
      files: ['**/__stories__/**/*.[jt]s?(x)', '**/?(*.)+(stories).[tj]s?(x)'],
    },
    {
      extends: ['plugin:jest/recommended'],
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    },
  ],
  ignorePatterns: [
    '.eslintrc.js',
    'next.config.js',
    'jest.globalSetup.js',
    'jest.config.js',
    '__mocks__/*',
  ],
};
