/**
 * Oxlint jsPlugin: sort-hook-deps
 *
 * Enforces alphabetical sorting of dependency arrays in React hooks.
 * Targets: useEffect, useMemo, useCallback, useLayoutEffect,
 *          useInsertionEffect, useImperativeHandle
 *
 * Provides auto-fix via `pnpm lint:oxlint:fix`.
 */

const HOOKS_WITH_DEPS = new Set([
  "useEffect",
  "useMemo",
  "useCallback",
  "useLayoutEffect",
  "useInsertionEffect",
  "useImperativeHandle",
]);

/**
 * Get the source text representation of an AST node for sorting.
 * @param {import("eslint").Rule.RuleContext} context
 * @param {import("estree").Expression} node
 * @returns {string}
 */
function getSortKey(context, node) {
  return context.sourceCode.getText(node);
}

/**
 * Extract the dependency array node from a hook call.
 * @param {import("estree").CallExpression} node
 * @returns {import("estree").ArrayExpression | null}
 */
function getDepsArray(node) {
  const calleeName = getHookName(node.callee);
  if (calleeName === null || !HOOKS_WITH_DEPS.has(calleeName)) {
    return null;
  }

  // useImperativeHandle(ref, createFn, deps?) — deps is 3rd arg
  // All others: hook(fn, deps?) — deps is 2nd arg
  const depsIndex = calleeName === "useImperativeHandle" ? 2 : 1;
  const depsArg = node.arguments[depsIndex];

  if (depsArg?.type === "ArrayExpression") {
    return depsArg;
  }
  return null;
}

/**
 * Get the hook name from a callee node.
 * Handles `useEffect` and `React.useEffect` patterns.
 * @param {import("estree").Expression} callee
 * @returns {string | null}
 */
function getHookName(callee) {
  if (callee.type === "Identifier") {
    return callee.name;
  }
  if (
    callee.type === "MemberExpression" &&
    callee.object.type === "Identifier" &&
    callee.property.type === "Identifier"
  ) {
    return callee.property.name;
  }
  return null;
}

/** @type {import("eslint").ESLint.Plugin} */
export default {
  meta: { name: "sort-hook-deps" },
  rules: {
    /** @type {import("eslint").Rule.RuleModule} */
    "sort-deps": {
      meta: {
        fixable: "code",
      },
      create(context) {
        return {
          /** @param {import("eslint").Rule.Node & import("estree").CallExpression} node */
          CallExpression(node) {
            const depsArray = getDepsArray(node);
            if (!depsArray || depsArray.elements.length < 2) {
              return;
            }

            // Skip arrays that contain spread elements or holes
            if (
              depsArray.elements.some(
                (el) => !el || el.type === "SpreadElement",
              )
            ) {
              return;
            }

            const { elements } = depsArray;
            const sortKeys = elements.map((el) => getSortKey(context, el));

            // Check if already sorted (case-insensitive)
            const isSorted = sortKeys.every(
              (key, i) =>
                i === 0 ||
                key.localeCompare(sortKeys[i - 1], undefined, {
                  sensitivity: "base",
                }) >= 0,
            );

            if (isSorted) {
              return;
            }

            const hookName = getHookName(node.callee);

            context.report({
              node: depsArray,
              message: `Dependencies of ${hookName} hook are not sorted alphabetically.`,
              fix(fixer) {
                // Build pairs of [sortKey, sourceText] and sort
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

                // Reconstruct the array content, preserving brackets
                const [firstElement] = elements;
                const [rangeStart, rangeEnd] = firstElement.range;

                // Detect separator style from source
                const originalText = context.sourceCode
                  .getText()
                  .slice(rangeStart, rangeEnd);
                const isMultiline = originalText.includes("\n");

                if (isMultiline) {
                  return fixer.replaceTextRange(
                    [rangeStart, rangeEnd],
                    sorted.join(`,\n${guessIndent(context, elements[0])}`),
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
    },
  },
};

/**
 * Guess indentation of a node by looking at its line start.
 * @param {import("eslint").Rule.RuleContext} context
 * @param {import("estree").Expression} node
 * @returns {string}
 */
function guessIndent(context, node) {
  const line = context.sourceCode.lines[node.loc.start.line - 1];
  const match = line.match(/^(\s*)/);
  return match ? match[1] : "";
}
