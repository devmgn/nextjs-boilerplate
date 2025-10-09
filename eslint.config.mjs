import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import vitest from "@vitest/eslint-plugin";
import reactCompiler from "eslint-plugin-react-compiler";
import storybook from "eslint-plugin-storybook";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/newline-after-import": "error",
      "lines-around-directive": "error",
      "no-multiple-empty-lines": "error",
      "no-var": "off",
      "no-restricted-syntax": [
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
    },
  },
  reactCompiler.configs.recommended,
  ...tanstackQuery.configs["flat/recommended"],
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/require-top-level-describe": "error",
    },
  },
  {
    ignores: [
      ".next/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "out/**",
      "src/api/openapi/**",
      "storybook-static/**",
      "public/**",
    ],
  },
];

// biome-ignore lint/style/noDefaultExport: use default export
export default config;
