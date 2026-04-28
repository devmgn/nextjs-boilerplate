import type { ESTree, Rule } from "@oxlint/plugins";

const rule: Rule = {
  meta: { fixable: "whitespace" },
  create(context) {
    let lastImport: ESTree.ImportDeclaration | null = null;

    return {
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
          const target = lastImport;
          context.report({
            node: target,
            message: "Expected empty line after the last import statement.",
            fix(fixer) {
              return fixer.insertTextAfter(target, "\n");
            },
          });
        }
      },
    };
  },
};

export default rule;
