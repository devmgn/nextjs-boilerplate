import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";
import {
  generatedSources,
  staticAssets,
  vendoredSources,
} from "./tools/lint-ignore/index.ts";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    ...staticAssets,
    ...generatedSources,
    ...vendoredSources,
  ],
  sortImports: {
    groups: [
      "side_effect",
      "type",
      "builtin",
      "subpath",
      "external",
      "internal",
      "index",
      "sibling",
      "parent",
      "style",
      "import",
      "side_effect_style",
    ],
    ignoreCase: false,
    newlinesBetween: false,
  },
  jsdoc: {
    lineWrappingStyle: "balance",
  },
  sortTailwindcss: {
    stylesheet: "./src/lib/styles/globals.css",
    attributes: ["className"],
    functions: ["tv"],
  },
});
