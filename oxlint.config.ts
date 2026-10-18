import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import { jsPluginSettings, selectJsPlugins } from "ultracite/oxlint/js-plugins";
import next from "ultracite/oxlint/next";
import nextJsPlugins from "ultracite/oxlint/next/js-plugins";
import react from "ultracite/oxlint/react";
import storybook from "ultracite/oxlint/storybook";
import tanstack from "ultracite/oxlint/tanstack";
import tanstackJsPlugins from "ultracite/oxlint/tanstack/js-plugins";
import vitest from "ultracite/oxlint/vitest";
import {
  generatedSources,
  staticAssets,
  vendoredSources,
} from "./tools/lint-ignore/index.ts";

const jsPlugins = selectJsPlugins([
  "github",
  "jsdoc-js",
  "sonarjs",
  "tsdoc",
  "react-doctor",
]);

export default defineConfig({
  env: core.env,
  extends: [
    core,
    react,
    next,
    tanstack,
    vitest,
    storybook,
    nextJsPlugins,
    tanstackJsPlugins,
    antiSlop,
    jsPlugins,
  ],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ...staticAssets,
    ...generatedSources,
    ...vendoredSources,
  ],
  jsPlugins: [
    ...jsPlugins.jsPlugins,
    "./tools/oxlint-rules/index.ts",
    "@tanstack/eslint-plugin-query",
  ],
  settings: {
    ...jsPluginSettings,
    vitest: { typecheck: true },
    // Treat our own wrappers as their native elements. Without this, violations through wrappers go undetected.
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
    // Forbid console.log. Allow warn / error as intentional output
    "eslint/no-console": ["error", { allow: ["error", "warn"] }],

    // custom-rules/no-restricted-syntax forbids top-level arrows, which conflicts
    // with func-style enforcing expressions
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
        "react/rules-of-hooks": "off",

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
