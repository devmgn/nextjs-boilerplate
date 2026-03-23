import newlineAfterImport from "./newline-after-import.mjs";
import noIndexTsx from "./no-index-tsx.mjs";
import noTopLevelArrow from "./no-top-level-arrow.mjs";
import sortHookDeps from "./sort-hook-deps.mjs";

/** @type {import("eslint").ESLint.Plugin} */
export default {
  meta: { name: "custom-rules" },
  rules: {
    "newline-after-import": newlineAfterImport,
    "no-index-tsx": noIndexTsx,
    "no-top-level-arrow": noTopLevelArrow,
    "sort-hook-deps": sortHookDeps,
  },
};
