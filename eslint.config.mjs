import tanstackQuery from "@tanstack/eslint-plugin-query";
import vitest from "@vitest/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactCompiler from "eslint-plugin-react-compiler";
import storybook from "eslint-plugin-storybook";

// biome-ignore lint/style/noDefaultExport: use default export
export default defineConfig([
  ...nextVitals,
  ...nextTs,
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
  globalIgnores([
    ".next/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "out/**",
    "public/**",
    "src/api/openapi/**",
    "storybook-static/**",
  ]),
]);
