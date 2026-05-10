import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import sortHookDeps from "./sort-hook-deps.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    sourceType: "module",
    parserOptions: { lang: "tsx" },
  },
});

tester.run("custom-rules/sort-hook-deps", sortHookDeps, {
  valid: [
    {
      name: "useEffect with sorted deps",
      code: "useEffect(() => {}, [a, b]);",
    },
    {
      name: "useEffect with empty deps",
      code: "useEffect(() => {}, []);",
    },
    {
      name: "useEffect with single dep",
      code: "useEffect(() => {}, [a]);",
    },
    {
      name: "useEffect without deps argument",
      code: "useEffect(() => {});",
    },
    {
      name: "deps array containing spread is skipped",
      code: "useEffect(() => {}, [...deps]);",
    },
    {
      name: "non-tracked hook is ignored",
      code: "useState([z, a]);",
    },
    {
      name: "useImperativeHandle sorted at index 2",
      code: "useImperativeHandle(ref, () => ({}), [a, b]);",
    },
    {
      name: "case-insensitive sorted (Apple before banana)",
      code: "useEffect(() => {}, [Apple, banana]);",
    },
    {
      name: "member-call hook (obj.useEffect) is also tracked when sorted",
      code: "React.useEffect(() => {}, [a, b]);",
    },
    {
      name: "additionalHooks (string) sorted is valid",
      code: "useCustomEffect(() => {}, [a, b]);",
      options: [{ additionalHooks: ["useCustomEffect"] }],
    },
    {
      name: "additionalHooks not configured → custom hook ignored",
      code: "useCustomEffect(() => {}, [b, a]);",
    },
    {
      name: "additionalHooks with object form (depsIndex=2) sorted is valid",
      code: "useDeepEffect(ref, () => {}, [a, b]);",
      options: [{ additionalHooks: [{ name: "useDeepEffect", depsIndex: 2 }] }],
    },
    {
      name: "options can override default hook depsIndex",
      code: "useEffect(ref, () => {}, [a, b]);",
      options: [{ additionalHooks: [{ name: "useEffect", depsIndex: 2 }] }],
    },
    {
      name: "computed member callee is ignored",
      code: "obj['useEffect'](() => {}, [b, a]);",
    },
    {
      name: "non-Identifier non-MemberExpression callee is ignored",
      code: "(0, useEffect)(() => {}, [b, a]);",
    },
    {
      name: "deps argument as identifier (not array literal) is ignored",
      code: "useEffect(() => {}, deps);",
    },
    {
      name: "sparse array deps (null element) is skipped",
      code: "useEffect(() => {}, [a, , b]);",
    },
    {
      name: "additionalHooks with invalid entries silently ignored",
      code: "useFoo(() => {}, [b, a]);",
      options: [
        {
          additionalHooks: [
            42,
            "",
            { name: "" },
            { name: "useFoo", depsIndex: -1 },
            { name: "useFoo", depsIndex: 1.5 },
          ],
        },
      ],
    },
    {
      name: "options[0] without additionalHooks key uses defaults",
      code: "useEffect(() => {}, [a, b]);",
      options: [{ unrelated: true }],
    },
    {
      name: "options[0] is non-object",
      code: "useEffect(() => {}, [a, b]);",
      options: ["string-option"],
    },
  ],
  invalid: [
    {
      name: "useEffect deps reversed",
      code: "useEffect(() => {}, [b, a]);",
      output: "useEffect(() => {}, [a, b]);",
      errors: [{ message: /not sorted/iu }],
    },
    {
      name: "useMemo with three unsorted deps",
      code: "useMemo(() => x, [c, b, a]);",
      output: "useMemo(() => x, [a, b, c]);",
      errors: 1,
    },
    {
      name: "useCallback unsorted",
      code: "useCallback(() => {}, [bar, abc]);",
      output: "useCallback(() => {}, [abc, bar]);",
      errors: 1,
    },
    {
      name: "useImperativeHandle unsorted at index 2",
      code: "useImperativeHandle(ref, () => ({}), [b, a]);",
      output: "useImperativeHandle(ref, () => ({}), [a, b]);",
      errors: 1,
    },
    {
      name: "useLayoutEffect unsorted",
      code: "useLayoutEffect(() => {}, [b, a]);",
      output: "useLayoutEffect(() => {}, [a, b]);",
      errors: 1,
    },
    {
      name: "case-insensitive sort moves Apple before banana",
      code: "useEffect(() => {}, [banana, Apple]);",
      output: "useEffect(() => {}, [Apple, banana]);",
      errors: 1,
    },
    {
      name: "member-call hook (React.useEffect) is fixable",
      code: "React.useEffect(() => {}, [b, a]);",
      output: "React.useEffect(() => {}, [a, b]);",
      errors: 1,
    },
    {
      name: "multiline deps reformatted in place",
      code: "useEffect(() => {}, [\n  b,\n  a,\n]);",
      output: "useEffect(() => {}, [\n  a,\n  b,\n]);",
      errors: 1,
    },
    {
      name: "additionalHooks (string) is enforced",
      code: "useCustomEffect(() => {}, [b, a]);",
      output: "useCustomEffect(() => {}, [a, b]);",
      options: [{ additionalHooks: ["useCustomEffect"] }],
      errors: 1,
    },
    {
      name: "additionalHooks (object form, depsIndex=2) is enforced",
      code: "useDeepEffect(ref, () => {}, [b, a]);",
      output: "useDeepEffect(ref, () => {}, [a, b]);",
      options: [{ additionalHooks: [{ name: "useDeepEffect", depsIndex: 2 }] }],
      errors: 1,
    },
  ],
});
