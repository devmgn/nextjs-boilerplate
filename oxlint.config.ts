import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    reportUnusedDisableDirectives: "error",
    respectEslintDisableDirectives: false,
    typeAware: true,
    typeCheck: true,
  },
  env: {
    browser: true,
    builtin: true,
    node: true,
  },
  plugins: [
    "eslint",
    "import",
    "jsdoc",
    "jsx-a11y",
    "nextjs",
    "node",
    "oxc",
    "promise",
    "react",
    "typescript",
    "unicorn",
    "vitest",
  ],
  jsPlugins: [
    "./tools/oxlint-rules/index.ts",
    "@tanstack/eslint-plugin-query",
    { name: "react-compiler-rules", specifier: "eslint-plugin-react-hooks" },
  ],
  settings: {
    vitest: { typecheck: true },
  },
  ignorePatterns: ["public/**", "src/api/openapi/**", "src/mocks/**"],
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "error",
    perf: "error",
    restriction: "error",
    style: "error",
    suspicious: "error",
  },
  rules: {
    // ── eslint built-in rules ──
    "eslint/arrow-body-style": "off",
    "eslint/capitalized-comments": "off",
    "eslint/func-style": "off",
    "eslint/id-length": "off",
    "eslint/max-lines": "off",
    "eslint/max-lines-per-function": "off",
    "eslint/max-params": "off",
    "eslint/max-statements": "off",
    "eslint/no-console": ["error", { allow: ["error", "warn"] }],
    "eslint/no-duplicate-imports": [
      "error",
      { allowSeparateTypeImports: true },
    ],
    "eslint/no-magic-numbers": "off",
    "eslint/no-ternary": "off",
    "eslint/no-undefined": "off",
    "eslint/no-underscore-dangle": "off",
    "eslint/no-void": ["error", { allowAsStatement: true }],
    "eslint/prefer-named-capture-group": "off",
    "eslint/require-await": "off",
    "eslint/sort-imports": ["error", { ignoreDeclarationSort: true }],
    "eslint/sort-keys": "off",

    // ── eslint-plugin-import (built-in) ──
    "import/exports-last": "off",
    "import/group-exports": "off",
    "import/max-dependencies": "off",
    "import/no-named-export": "off",
    "import/no-relative-parent-imports": "off",
    "import/no-unassigned-import": "off",
    "import/prefer-default-export": "off",
    "import/unambiguous": "off",

    // ── eslint-plugin-jsdoc (built-in) ──
    "jsdoc/require-param": "off",
    "jsdoc/require-param-description": "off",
    "jsdoc/require-param-type": "off",
    "jsdoc/require-returns": "off",
    "jsdoc/require-returns-description": "off",
    "jsdoc/require-returns-type": "off",

    // ── eslint-plugin-node (built-in) ──
    "node/no-process-env": "off",

    // ── oxlint built-in rules ──
    "oxc/no-async-await": "off",
    "oxc/no-optional-chaining": "off",
    "oxc/no-rest-spread-properties": "off",

    // ── eslint-plugin-promise (built-in) ──
    "promise/avoid-new": "off",
    "promise/prefer-await-to-callbacks": "off",

    // ── eslint-plugin-react (built-in) ──
    "react/forbid-component-props": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-max-depth": "off",
    "react/jsx-props-no-spreading": "off",
    "react/only-export-components": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unstable-nested-components": [
      "error",
      { propNamePattern: "{render,*Render}*" },
    ],

    // ── eslint-plugin-typescript (built-in) ──
    "typescript/array-type": [
      "error",
      { default: "array-simple", readonly: "array-simple" },
    ],
    "typescript/explicit-function-return-type": "off",
    "typescript/explicit-module-boundary-types": "off",
    "typescript/prefer-readonly-parameter-types": "off",
    "typescript/strict-void-return": "off",

    // ── eslint-plugin-unicorn (built-in) ──
    "unicorn/filename-case": [
      "error",
      { cases: { camelCase: true, kebabCase: true, pascalCase: true } },
    ],
    "unicorn/import-style": ["error", { styles: { zod: { named: true } } }],
    "unicorn/no-null": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/prefer-global-this": "off",
    "unicorn/switch-case-braces": ["error", "avoid"],

    // ── eslint-plugin-vitest (built-in) ──
    "vitest/consistent-test-it": ["error", { fn: "it" }],
    "vitest/no-hooks": "off",
    "vitest/no-importing-vitest-globals": "off",
    "vitest/no-standalone-expect": [
      "error",
      { additionalTestBlockFunctions: ["it.for"] },
    ],
    "vitest/prefer-called-once": "off",
    "vitest/prefer-expect-assertions": "off",
    "vitest/prefer-importing-vitest-globals": "off",
    "vitest/prefer-lowercase-title": "off",
    "vitest/prefer-to-be-falsy": "off",
    "vitest/prefer-to-be-truthy": "off",
    "vitest/require-hook": "off",
    "vitest/require-mock-type-parameters": "off",
    "vitest/require-test-timeout": "off",

    // ── @tanstack/eslint-plugin-query (jsPlugin) ──
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/infinite-query-property-order": "error",
    "@tanstack/query/mutation-property-order": "error",
    "@tanstack/query/no-rest-destructuring": "error",
    "@tanstack/query/no-unstable-deps": "error",
    "@tanstack/query/no-void-query-fn": "error",
    "@tanstack/query/prefer-query-options": "error",
    "@tanstack/query/stable-query-client": "error",

    // ── react-compiler-rules (jsPlugin: eslint-plugin-react-hooks) ──
    "react-compiler-rules/capitalized-calls": "error",
    "react-compiler-rules/config": "error",
    "react-compiler-rules/error-boundaries": "error",
    "react-compiler-rules/globals": "error",
    "react-compiler-rules/immutability": "error",
    "react-compiler-rules/incompatible-library": "warn",
    "react-compiler-rules/memoized-effect-dependencies": "error",
    "react-compiler-rules/no-deriving-state-in-effects": "error",
    "react-compiler-rules/preserve-manual-memoization": "error",
    "react-compiler-rules/purity": "error",
    "react-compiler-rules/refs": "error",
    "react-compiler-rules/set-state-in-effect": "error",
    "react-compiler-rules/set-state-in-render": "error",
    "react-compiler-rules/static-components": "error",
    "react-compiler-rules/unsupported-syntax": "warn",
    "react-compiler-rules/use-memo": "error",
    "react-compiler-rules/void-use-memo": "error",

    // ── custom rules (jsPlugin: ./tools/oxlint-rules/) ──
    "custom-rules/no-index-tsx": "error",
    "custom-rules/no-restricted-syntax": [
      "error",
      {
        selector:
          "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
        message: "Use function declarations at the top level",
      },
      {
        selector:
          "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
        message: "Use function declarations for exported functions",
      },
    ],
    "custom-rules/sort-hook-deps": "error",
  },
  overrides: [
    {
      // Storybook stories
      files: ["**/*.stories.*", "**/*.story.*"],
      rules: {
        "import/no-default-export": "off",
        "react/rules-of-hooks": "off",
        "typescript/consistent-type-assertions": "off",
        "typescript/no-explicit-any": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-assignment": "off",

        // eslint-plugin-storybook (jsPlugin)
        "storybook/await-interactions": "error",
        "storybook/context-in-play-function": "error",
        "storybook/csf-component": "error",
        "storybook/default-exports": "error",
        "storybook/hierarchy-separator": "error",
        "storybook/meta-inline-properties": "error",
        "storybook/meta-satisfies-type": "error",
        "storybook/no-redundant-story-name": "error",
        "storybook/no-renderer-packages": "error",
        "storybook/no-stories-of": "error",
        "storybook/no-title-property-in-meta": "error",
        "storybook/prefer-pascal-case": "error",
        "storybook/story-exports": "error",
        "storybook/use-storybook-expect": "error",
        "storybook/use-storybook-testing-library": "error",

        // ── @tanstack/eslint-plugin-query (jsPlugin) ──
        "@tanstack/query/prefer-query-options": "off",
      },
      jsPlugins: ["eslint-plugin-storybook"],
    },
    {
      // Storybook main config
      files: [".storybook/main.*"],
      rules: {
        "storybook/no-uninstalled-addons": "error",
      },
      jsPlugins: ["eslint-plugin-storybook"],
    },
    {
      // Test files
      files: ["**/*.test.*", "**/*.spec.*", "**/*.test-d.*"],
      rules: {
        "eslint/init-declarations": "off",
        "eslint/no-empty-function": "off",
        "eslint/no-undef": "off",
        "typescript/consistent-type-assertions": "off",
        "typescript/no-explicit-any": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-type-assertion": "off",
      },
    },
    {
      // default export を許可するファイル群:
      files: [
        ".storybook/main.ts",
        ".storybook/preview.tsx",
        "next.config.ts",
        "oxfmt.config.ts",
        "oxlint.config.ts",
        "postcss.config.mjs",
        "vitest.config.ts",
        "vitest.globalSetup.ts",
        // Next.js 規約ファイル (vitest.config.ts と同じ brace glob スタイル)
        "src/**/{default,error,forbidden,global-error,layout,loading,not-found,page,template,unauthorized}.tsx",
        "src/**/{instrumentation-client,instrumentation,proxy,sitemap}.ts",
        "tools/oxlint-rules/**/*.ts",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
});
