/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: { fixable: "whitespace" },
  create(context) {
    /** @type {import("estree").ImportDeclaration | null} */
    let lastImport = null;

    return {
      /** @param {import("estree").ImportDeclaration} node */
      ImportDeclaration(node) {
        lastImport = node;
      },
      "Program:exit"() {
        if (!lastImport) {
          return;
        }

        const { sourceCode } = context;
        const tokenAfter = sourceCode.getTokenAfter(lastImport);

        if (!tokenAfter) {
          return;
        }

        const lastImportEnd = lastImport.loc.end.line;
        const nextTokenStart = tokenAfter.loc.start.line;

        if (nextTokenStart - lastImportEnd < 2) {
          context.report({
            node: lastImport,
            message: "Expected empty line after the last import statement.",
            fix(fixer) {
              return fixer.insertTextAfter(lastImport, "\n");
            },
          });
        }
      },
    };
  },
};
