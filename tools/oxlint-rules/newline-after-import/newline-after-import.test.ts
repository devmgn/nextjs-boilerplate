import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import newlineAfterImport from "./newline-after-import.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    sourceType: "module",
    parserOptions: { lang: "ts" },
  },
});

tester.run("custom-rules/newline-after-import", newlineAfterImport, {
  valid: [
    {
      name: "no imports",
      code: "const x = 1;\n",
    },
    {
      name: "single import followed by blank line",
      code: "import x from 'a';\n\nconst y = 1;\n",
    },
    {
      name: "single import followed by multiple blank lines",
      code: "import x from 'a';\n\n\nconst y = 1;\n",
    },
    {
      name: "file containing only imports",
      code: "import x from 'a';\n",
    },
    {
      name: "consecutive imports with blank line after the last",
      code: "import a from 'a';\nimport b from 'b';\n\nconst c = 1;\n",
    },
  ],
  invalid: [
    {
      name: "single import directly followed by code",
      code: "import x from 'a';\nconst y = 1;\n",
      output: "import x from 'a';\n\nconst y = 1;\n",
      errors: [{ message: /empty line/iu }],
    },
    {
      name: "multiple imports, last one directly followed by code",
      code: "import a from 'a';\nimport b from 'b';\nconst c = 1;\n",
      output: "import a from 'a';\nimport b from 'b';\n\nconst c = 1;\n",
      errors: 1,
    },
  ],
});
