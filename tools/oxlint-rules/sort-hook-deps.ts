import type { Context, ESTree, Rule } from "@oxlint/plugins";

/**
 * Enforces alphabetical sorting of dependency arrays in React hooks.
 * Targets: useEffect, useMemo, useCallback, useLayoutEffect,
 * useInsertionEffect, useImperativeHandle.
 */

const HOOKS_WITH_DEPS = new Set([
  "useEffect",
  "useMemo",
  "useCallback",
  "useLayoutEffect",
  "useInsertionEffect",
  "useImperativeHandle",
]);

function getSortKey(context: Context, node: ESTree.Expression): string {
  return context.sourceCode.getText(node);
}

function getHookName(callee: ESTree.Expression | ESTree.Super): string | null {
  if (callee.type === "Identifier") {
    return callee.name;
  }
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    return callee.property.name;
  }
  return null;
}

function getDepsArray(
  node: ESTree.CallExpression,
): ESTree.ArrayExpression | null {
  const calleeName = getHookName(node.callee);
  if (calleeName === null || !HOOKS_WITH_DEPS.has(calleeName)) {
    return null;
  }

  const depsIndex = calleeName === "useImperativeHandle" ? 2 : 1;
  if (node.arguments.length <= depsIndex) {
    return null;
  }
  const depsArg = node.arguments[depsIndex];

  if (depsArg.type === "ArrayExpression") {
    return depsArg;
  }
  return null;
}

function guessIndent(context: Context, node: ESTree.Expression): string {
  const line = context.sourceCode.lines.at(node.loc.start.line - 1) ?? "";
  const match = /^(\s*)/u.exec(line);
  return match ? match[1] : "";
}

const rule: Rule = {
  meta: { fixable: "code" },
  create(context) {
    return {
      CallExpression(node) {
        const depsArray = getDepsArray(node);
        if (!depsArray || depsArray.elements.length < 2) {
          return;
        }

        const elements: ESTree.Expression[] = [];
        for (const el of depsArray.elements) {
          if (!el || el.type === "SpreadElement") {
            return;
          }
          elements.push(el);
        }

        const sortKeys = elements.map((el) => getSortKey(context, el));

        const isSorted = sortKeys.every((key, i) => {
          if (i === 0) {
            return true;
          }
          const previous = sortKeys.at(i - 1) ?? "";
          return (
            key.localeCompare(previous, undefined, {
              sensitivity: "base",
            }) >= 0
          );
        });

        if (isSorted) {
          return;
        }

        const hookName = getHookName(node.callee);

        context.report({
          node: depsArray,
          message: `Dependencies of ${hookName} hook are not sorted alphabetically.`,
          fix(fixer) {
            const pairs = elements.map((el) => ({
              key: getSortKey(context, el),
              text: context.sourceCode.getText(el),
            }));
            pairs.sort((a, b) =>
              a.key.localeCompare(b.key, undefined, {
                sensitivity: "base",
              }),
            );

            const sorted = pairs.map((p) => p.text);

            const [firstElement] = elements;
            const lastElement = elements.at(-1);
            if (lastElement === undefined) {
              return null;
            }
            const [rangeStart] = firstElement.range;
            const [, rangeEnd] = lastElement.range;

            const originalText = context.sourceCode
              .getText()
              .slice(rangeStart, rangeEnd);
            const isMultiline = originalText.includes("\n");

            if (isMultiline) {
              return fixer.replaceTextRange(
                [rangeStart, rangeEnd],
                sorted.join(`,\n${guessIndent(context, firstElement)}`),
              );
            }

            return fixer.replaceTextRange(
              [rangeStart, rangeEnd],
              sorted.join(", "),
            );
          },
        });
      },
    };
  },
};

export default rule;
