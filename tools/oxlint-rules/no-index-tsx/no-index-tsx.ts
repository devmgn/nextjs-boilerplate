import type { Rule } from "@oxlint/plugins";

const rule: Rule = {
  create(context) {
    const { filename } = context;
    if (!filename.endsWith("/index.tsx") && !filename.endsWith("/index.jsx")) {
      return {};
    }
    return {
      Program(node) {
        context.report({
          node,
          message:
            "Use a named file (e.g., ComponentName.tsx) with an index.ts re-export instead of index.tsx.",
        });
      },
    };
  },
};

export default rule;
