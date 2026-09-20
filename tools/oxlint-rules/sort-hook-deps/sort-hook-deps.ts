import type { Context, ESTree, Rule } from "@oxlint/plugins";
import type { JsonObject, JsonValue } from "oxlint/plugins-dev";

/**
 * Enforces alphabetical sorting of dependency arrays in React hooks.
 * Defaults: useEffect, useMemo, useCallback, useLayoutEffect,
 * useInsertionEffect, useImperativeHandle.
 *
 * Consumers can extend the tracked hooks via the `additionalHooks` option:
 * ["error", { additionalHooks: ["useCustomEffect", { name: "useDeepEffect",
 * depsIndex: 2 }] }]
 */

const DEFAULT_HOOKS: ReadonlyMap<string, number> = new Map([
  ["useEffect", 1],
  ["useMemo", 1],
  ["useCallback", 1],
  ["useLayoutEffect", 1],
  ["useInsertionEffect", 1],
  ["useImperativeHandle", 2],
]);

/** `additionalHooks` にオブジェクト形式で渡すフック指定。 */
type HookSpec = JsonObject & {
  readonly name: string;
  readonly depsIndex: number;
};

/** このルールが受け取るオプション。設定ファイル由来なので値は JSON の範囲。 */
type SortHookDepsOption = JsonObject & {
  readonly additionalHooks?: readonly JsonValue[];
};

function isOptionObject(value: JsonValue): value is SortHookDepsOption {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** フック名のみを渡す短縮形。deps は第 2 引数とみなす。 */
function isHookName(item: JsonValue): item is string {
  return typeof item === "string" && item.length > 0;
}

function isHookSpec(item: JsonValue): item is HookSpec {
  if (item === null || typeof item !== "object") {
    return false;
  }
  if (!("name" in item) || !("depsIndex" in item)) {
    return false;
  }
  const { name, depsIndex } = item;
  if (typeof name !== "string" || name.length === 0) {
    return false;
  }
  return (
    typeof depsIndex === "number" &&
    Number.isInteger(depsIndex) &&
    depsIndex >= 0
  );
}

/** オプション配列の先頭から additionalHooks を取り出す。未指定なら空配列。 */
function readAdditionalHooks(
  options: Context["options"]
): readonly JsonValue[] {
  const opt = options.find(isOptionObject);
  return opt?.additionalHooks ?? [];
}

function buildHookMap(options: Context["options"]): Map<string, number> {
  const map = new Map(DEFAULT_HOOKS);
  const additionalHooks = readAdditionalHooks(options);
  for (const item of additionalHooks) {
    if (isHookName(item)) {
      map.set(item, 1);
    } else if (isHookSpec(item)) {
      map.set(item.name, item.depsIndex);
    }
  }
  return map;
}

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
  hooks: ReadonlyMap<string, number>
): ESTree.ArrayExpression | null {
  const calleeName = getHookName(node.callee);
  if (calleeName === null) {
    return null;
  }
  const depsIndex = hooks.get(calleeName);
  if (depsIndex === undefined) {
    return null;
  }
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
  /* v8 ignore next -- lines.at always returns a string for in-range indices */
  const line = context.sourceCode.lines.at(node.loc.start.line - 1) ?? "";
  const match = /^(?<indent>\s*)/u.exec(line);
  /* v8 ignore next -- 行頭の \s* は必ずマッチする */
  return match?.groups?.indent ?? "";
}

const rule: Rule = {
  meta: { fixable: "code", schema: false },
  create(context) {
    const hookMap = buildHookMap(context.options);

    return {
      // AST ノード型名は oxlint のビジター API が決めるため改名不可
      // oxlint-disable-next-line sonarjs/function-name
      CallExpression(node) {
        const depsArray = getDepsArray(node, hookMap);
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
          /* v8 ignore next -- i >= 1 and sortKeys length >= 2 → always defined */
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
              })
            );

            const sorted = pairs.map((p) => p.text);

            const [firstElement] = elements;
            const lastElement = elements.at(-1);
            /* v8 ignore next 3 -- elements.length >= 2 guaranteed above */
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
                sorted.join(`,\n${guessIndent(context, firstElement)}`)
              );
            }

            return fixer.replaceTextRange(
              [rangeStart, rangeEnd],
              sorted.join(", ")
            );
          },
        });
      },
    };
  },
};

export default rule;
