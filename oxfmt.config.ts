import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [".*/skills/**", "public/**", "src/api/openapi/**"],
  printWidth: 80,
  experimentalSortImports: {
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
