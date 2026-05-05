import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "*.lock.yaml",
    ".claude/skills/**",
    "public/**",
    "src/api/openapi/**",
    "src/mocks/**",
  ],
  printWidth: 80,
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
