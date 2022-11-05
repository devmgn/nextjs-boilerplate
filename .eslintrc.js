module.exports = {
  extends: ['next', 'next/core-web-vitals', 'prettier', 'plugin:storybook/recommended'],
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  rules: {
    'prefer-template': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    '@next/next/no-img-element': 'off',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-boolean-value': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/jsx-pascal-case': 'warn',
    'react/no-array-index-key': 'error',
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true,
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/no-inferrable-types': 'warn',
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
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'next.config.js',
          '**/jest.setup.{ts,tsx}',
          '**/*.{test,stories}.{ts,tsx}',
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
};
