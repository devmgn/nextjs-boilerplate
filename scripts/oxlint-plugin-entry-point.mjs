/** @type {import("eslint").ESLint.Plugin} */
export default {
  meta: { name: "entry-point" },
  rules: {
    /** @type {import("eslint").Rule.RuleModule} */
    "no-index-tsx": {
      create(context) {
        const { filename } = context;
        if (
          !filename.endsWith("/index.tsx") &&
          !filename.endsWith("/index.jsx")
        ) {
          return {};
        }
        return {
          /** @param {import("eslint").Rule.Node & import("estree").Program} node */
          Program(node) {
            context.report({
              node,
              message:
                "Use a named file (e.g., ComponentName.tsx) with an index.ts re-export instead of index.tsx.",
            });
          },
        };
      },
    },
  },
};
