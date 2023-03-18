module.exports = {
  env: {
    'jest/globals': true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'arrow-body-style': 'off',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "TSEnumDeclaration",
        "message": "Don't declare enums"
      }
    ],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: ['typeAlias', 'class'],
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
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
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          ['parent', 'sibling'],
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
            pattern: '{react-dom,react-dom/**}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '{react-redux,@reduxjs,@reduxjs/**}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['type'],
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
      files: ['**/?(*.)+(stories).[tj]s?(x)'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      extends: ['plugin:jest/recommended'],
      files: ['**/?(*.)+(spec|test).[tj]s?(x)', 'jest.setup.js?(x)'],
    },
  ],
};
