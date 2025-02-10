import { FlatCompat } from "@eslint/eslintrc";
import vitest from "@vitest/eslint-plugin";
import reactCompiler from "eslint-plugin-react-compiler";

const compat = new FlatCompat();

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ),
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "import/newline-after-import": "error",
      "lines-around-directive": "error",
      "no-multiple-empty-lines": "error",
      "prefer-template": "error",
      "react-compiler/react-compiler": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-sort-props": "error",
    },
  },
  ...compat.extends("plugin:storybook/recommended").map((config) => ({
    ...config,
    files: ["**/*.stories.ts?(x)"],
  })),
  {
    files: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/require-top-level-describe": ["error"],
    },
  },
  { ignores: ["src/api/openapi"] },
];

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config;
