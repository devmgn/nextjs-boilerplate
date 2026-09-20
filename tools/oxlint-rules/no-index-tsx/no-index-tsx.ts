import type { Rule } from "@oxlint/plugins";

const rule: Rule = {
  create(context) {
    const { filename } = context;
    if (!filename.endsWith("/index.tsx") && !filename.endsWith("/index.jsx")) {
      return {};
    }
    return {
      // AST ノード型名は oxlint のビジター API が決めるため改名不可
      // oxlint-disable-next-line sonarjs/function-name
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
