import type { Rule } from "@oxlint/plugins";

const rule: Rule = {
  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.init?.type !== "ArrowFunctionExpression") {
          return;
        }
        const grandparent = node.parent.parent;
        if (grandparent === null) {
          return;
        }
        const isTopLevel =
          grandparent.type === "Program" ||
          (grandparent.type === "ExportNamedDeclaration" &&
            grandparent.parent.type === "Program");
        if (!isTopLevel) {
          return;
        }
        const name = node.id.type === "Identifier" ? node.id.name : "<unknown>";
        context.report({
          node,
          message: `Use function declaration instead of top-level arrow function: ${name}`,
        });
      },
    };
  },
};

export default rule;
