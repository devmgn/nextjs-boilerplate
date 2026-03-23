import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    reportUnusedDisableDirectives: "error",
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
    "./scripts/oxlint-custom-rules/index.mjs",
    "@tanstack/eslint-plugin-query",
    { name: "react-compiler-rules", specifier: "eslint-plugin-react-hooks" },
  ],
  settings: {
    vitest: { typecheck: true },
  },
  ignorePatterns: [
    ".next/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "node_modules/**",
    "out/**",
    "public/**",
    "src/api/openapi/**",
    "storybook-static/**",
  ],
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
    "eslint/no-void": ["error", { allowAsStatement: true }],
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

    // ── eslint-plugin-node (built-in) ──
    "node/no-process-env": "off",

    // ── oxlint built-in rules ──
    "oxc/no-async-await": "off",
    "oxc/no-optional-chaining": "off",
    "oxc/no-rest-spread-properties": "off",

    // ── eslint-plugin-react (built-in) ──
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-max-depth": "off",
    "react/jsx-props-no-spreading": "off",
    "react/only-export-components": "off",
    "react/react-in-jsx-scope": "off",

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
      { cases: { camelCase: true, pascalCase: true } },
    ],
    "unicorn/no-null": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/prefer-global-this": "off",
    "unicorn/switch-case-braces": ["error", "avoid"],

    // ── eslint-plugin-vitest (built-in) ──
    "vitest/no-importing-vitest-globals": "off",
    "vitest/require-hook": "off",

    // ── @tanstack/eslint-plugin-query (jsPlugin) ──
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/infinite-query-property-order": "error",
    "@tanstack/query/mutation-property-order": "error",
    "@tanstack/query/no-rest-destructuring": "error",
    "@tanstack/query/no-unstable-deps": "error",
    "@tanstack/query/no-void-query-fn": "error",
    "@tanstack/query/stable-query-client": "error",

    // ── react-compiler-rules (jsPlugin: eslint-plugin-react-hooks) ──
    "react-compiler-rules/automatic-effect-dependencies": "error",
    "react-compiler-rules/capitalized-calls": "error",
    "react-compiler-rules/component-hook-factories": "error",
    "react-compiler-rules/config": "error",
    "react-compiler-rules/error-boundaries": "error",
    "react-compiler-rules/gating": "error",
    "react-compiler-rules/globals": "error",
    "react-compiler-rules/hooks": "error",
    "react-compiler-rules/immutability": "error",
    "react-compiler-rules/incompatible-library": "error",
    "react-compiler-rules/memoized-effect-dependencies": "error",
    "react-compiler-rules/no-deriving-state-in-effects": "error",
    "react-compiler-rules/preserve-manual-memoization": "error",
    "react-compiler-rules/purity": "error",
    "react-compiler-rules/refs": "error",
    "react-compiler-rules/rule-suppression": "error",
    "react-compiler-rules/set-state-in-effect": "error",
    "react-compiler-rules/set-state-in-render": "error",
    "react-compiler-rules/static-components": "error",
    "react-compiler-rules/syntax": "error",
    "react-compiler-rules/unsupported-syntax": "error",
    "react-compiler-rules/use-memo": "error",
    "react-compiler-rules/void-use-memo": "error",

    // ── custom rules (jsPlugin: ./scripts/oxlint-custom-rules/) ──
    "custom-rules/newline-after-import": "error",
    "custom-rules/no-index-tsx": "error",
    "custom-rules/no-top-level-arrow": "error",
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
      files: ["**/*.test.*", "**/*.spec.*"],
      rules: {
        "eslint/init-declarations": "off",
        "eslint/no-empty-function": "off",
        "eslint/no-undef": "off",
        "typescript/consistent-type-assertions": "off",
        "typescript/no-explicit-any": "off",
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-type-assertion": "off",
        "vitest/consistent-test-it": ["error", { fn: "it" }],
        "vitest/prefer-called-once": "off",
        "vitest/prefer-to-be-falsy": "off",
        "vitest/prefer-to-be-truthy": "off",
        "vitest/no-standalone-expect": [
          "error",
          { additionalTestBlockFunctions: ["it.for"] },
        ],
      },
    },
    {
      // Scripts — plain .mjs files lack TS type info, so no-unsafe-* rules produce false positives
      files: ["scripts/**"],
      rules: {
        "typescript/no-redundant-type-constituents": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unsafe-member-access": "off",
        "typescript/no-unsafe-return": "off",
        "typescript/strict-boolean-expressions": "off",
        "import/no-anonymous-default-export": "off",
        "import/no-default-export": "off",
        "unicorn/filename-case": "off",
      },
    },
    {
      // Next.js special files + config files → allow default export, relax filename
      files: [
        ".storybook/main.ts",
        ".storybook/preview.tsx",
        "next.config.ts",
        "oxfmt.config.ts",
        "oxlint.config.ts",
        "postcss.config.mjs",
        "src/**/default.tsx",
        "src/**/error.tsx",
        "src/**/forbidden.tsx",
        "src/**/global-error.tsx",
        "src/**/instrumentation-client.ts",
        "src/**/instrumentation.ts",
        "src/**/layout.tsx",
        "src/**/loading.tsx",
        "src/**/not-found.tsx",
        "src/**/page.tsx",
        "src/**/proxy.ts",
        "src/**/sitemap.ts",
        "src/**/template.tsx",
        "src/**/unauthorized.tsx",
        "vitest.config.ts",
        "vitest.globalSetup.ts",
      ],
      rules: {
        "import/no-default-export": "off",
        "unicorn/filename-case": "off",
      },
    },
  ],
});
