import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins";
import next from "ultracite/oxlint/next";
import nextJsPlugins from "ultracite/oxlint/next/js-plugins";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins";
import vitest from "ultracite/oxlint/vitest";
import { generatedSources, staticAssets } from "./tools/lint-ignore/index.ts";

const jsPlugins = selectJsPlugins(["github", "sonarjs", "react-doctor"]);

export default defineConfig({
  extends: [
    core,
    react,
    tanstack,
    next,
    vitest,
    nextJsPlugins,
    tanstackJsPlugins,
    antiSlop,
    jsPlugins,
  ],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ...staticAssets,
    ...generatedSources,
  ],
  jsPlugins: [
    ...(jsPlugins.jsPlugins ?? []),
    "./tools/oxlint-rules/index.ts",
    "@tanstack/eslint-plugin-query",
  ],
  settings: {
    ...jsPluginSettings,
    vitest: { typecheck: true },
    // 自前ラッパーを素の要素として扱わせる。未設定だとラッパー経由の違反は検出されない。
    "jsx-a11y": {
      components: { Button: "button", Input: "input", Label: "label" },
    },
  },
  options: {
    reportUnusedDisableDirectives: "error",
    respectEslintDisableDirectives: false,
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    // console.log は禁止。warn / error は意図的な出力として許可する
    "eslint/no-console": ["error", { allow: ["error", "warn"] }],

    // custom-rules/no-restricted-syntax が top-level の arrow を禁止しており、
    // expression を強制する func-style とは両立しない
    "eslint/func-style": "off",
    "react/function-component-definition": [
      "error",
      { namedComponents: "function-declaration" },
    ],

    // ── @tanstack/eslint-plugin-query (jsPlugin) ──
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/infinite-query-property-order": "error",
    "@tanstack/query/mutation-property-order": "error",
    "@tanstack/query/no-rest-destructuring": "error",
    "@tanstack/query/no-unstable-deps": "error",
    "@tanstack/query/no-void-query-fn": "error",
    "@tanstack/query/prefer-query-options": "error",
    "@tanstack/query/stable-query-client": "error",

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
      jsPlugins: ["eslint-plugin-storybook"],
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
    },
    {
      // Storybook main config
      files: [".storybook/main.*"],
      rules: {
        "storybook/no-uninstalled-addons": "error",
      },
      jsPlugins: ["eslint-plugin-storybook"],
    },
  ],
});
