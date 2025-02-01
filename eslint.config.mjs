import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from "eslint-plugin-react-compiler";

const compat = new FlatCompat();

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
  ...compat.extends("plugin:@vitest/legacy-recommended").map((config) => ({
    ...config,
    files: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  })),
  {
    files: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    rules: {
      "@vitest/consistent-test-it": [2, { fn: "it" }],
      "@vitest/require-top-level-describe": ["error"],
    },
  },
  { ignores: ["src/openapi"] },
];

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config;
