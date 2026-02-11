/** @type {import("eslint").ESLint.Plugin} */
export default {
  meta: { name: "fn-style" },
  rules: {
    /** @type {import("eslint").Rule.RuleModule} */
    "no-top-level-arrow": {
      create(context) {
        return {
          /** @param {import("eslint").Rule.Node & import("estree").VariableDeclarator} node */
          VariableDeclarator(node) {
            if (node.init?.type !== "ArrowFunctionExpression") {
              return;
            }
            const varDecl = node.parent;
            const parent = varDecl?.parent;
            const isTopLevel =
              parent?.type === "Program" ||
              (parent?.type === "ExportNamedDeclaration" &&
                parent?.parent?.type === "Program");
            if (isTopLevel) {
              context.report({
                node,
                message: `Use function declaration instead of top-level arrow function: ${node.id?.name}`,
              });
            }
          },
        };
      },
    },
  },
};
