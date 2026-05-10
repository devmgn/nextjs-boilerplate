import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import noIndexTsx from "./no-index-tsx.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: "tsx" } },
});

tester.run("custom-rules/no-index-tsx", noIndexTsx, {
  valid: [
    {
      name: "named tsx file is allowed",
      code: "export const Foo = () => null;",
      filename: "src/components/Foo.tsx",
    },
    {
      name: "deeply nested non-index file",
      code: "export const Button = () => null;",
      filename: "src/components/Button/Button.tsx",
    },
    {
      name: "index.ts (not .tsx) is allowed",
      code: "export {};",
      filename: "src/foo/index.ts",
    },
    {
      name: "uppercase INDEX.tsx is allowed (case-sensitive match)",
      code: "export const x = 1;",
      filename: "src/foo/INDEX.tsx",
    },
    {
      name: "index in name but not filename",
      code: "export const x = 1;",
      filename: "src/foo/myindex.tsx",
    },
  ],
  invalid: [
    {
      name: "index.tsx triggers the rule",
      code: "export const x = 1;",
      filename: "src/foo/index.tsx",
      errors: [{ message: /Use a named file/u }],
    },
    {
      name: "index.jsx triggers the rule",
      code: "export const x = 1;",
      filename: "src/foo/index.jsx",
      errors: 1,
    },
    {
      name: "deeply nested index.tsx triggers the rule",
      code: "export const x = 1;",
      filename: "src/components/Button/index.tsx",
      errors: 1,
    },
  ],
});
