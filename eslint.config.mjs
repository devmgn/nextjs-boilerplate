import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from "eslint-plugin-react-compiler";

const compat = new FlatCompat();

const config = [
  {
    ignores: ["src/components/ui/**/**/*"],
  },
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
      "import/newline-after-import": "error",
      "lines-around-directive": "error",
      "next/no-img-element": "off",
      "no-multiple-empty-lines": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-sort-props": "error",
      "react-compiler/react-compiler": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  ...compat.extends("plugin:storybook/recommended").map((config) => ({
    ...config,
    files: ["**/*.stories.ts?(x)"],
  })),
  {
    files: ["**/*.stories.ts?(x)"],
    rules: { "no-console": "off" },
  },
  ...compat.extends("plugin:@vitest/legacy-recommended").map((config) => ({
    ...config,
    files: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  })),
  {
    files: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    rules: {
      "no-console": "off",
      "@vitest/consistent-test-it": [2, { fn: "it" }],
      "@vitest/require-top-level-describe": ["error"],
    },
  },
];

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config;
