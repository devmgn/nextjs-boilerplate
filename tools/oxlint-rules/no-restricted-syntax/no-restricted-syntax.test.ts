import type { Context } from "@oxlint/plugins";
import { RuleTester } from "oxlint/plugins-dev";
import { describe, expect, it } from "vitest";
import noRestrictedSyntax from "./no-restricted-syntax.ts";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: "ts" } },
});

tester.run("custom-rules/no-restricted-syntax", noRestrictedSyntax, {
  valid: [
    {
      name: "no options → no reports",
      code: "const x = 1;",
      options: [],
    },
    {
      name: "selector does not match anything",
      code: "function foo() {}",
      options: [{ selector: "TSEnumDeclaration", message: "no enum" }],
    },
    {
      name: "string-form selector with non-matching code",
      code: "const x = 1;",
      options: ["TSEnumDeclaration"],
    },
    {
      name: "child combinator: arrow inside function body is not top-level",
      code: "function outer() { const inner = (y: number) => y; }",
      options: [
        {
          selector:
            "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "no top-level arrow",
        },
      ],
    },
    {
      name: "attribute literal mismatch",
      code: "const f = function () {};",
      options: [
        {
          selector: "VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "should not fire",
        },
      ],
    },
    {
      name: "regex attribute mismatch",
      code: "import { regular } from 'mod';",
      options: [
        {
          selector: "ImportSpecifier[imported.name=/^_/]",
          message: "no underscore imports",
        },
      ],
    },
    {
      name: "descendant combinator with no matching ancestor",
      code: "function f() { const g = () => 1; return g; }",
      options: [
        {
          selector: "ExportNamedDeclaration ArrowFunctionExpression",
          message: "should not fire",
        },
      ],
    },
    {
      name: "boolean literal attribute mismatch",
      code: "obj[prop]();",
      options: [
        {
          selector: "MemberExpression[computed=false]",
          message: "should not fire on computed access",
        },
      ],
    },
    {
      name: "non-object option entry is silently ignored",
      code: "const x = 1;",
      options: [42, null, { notSelector: "x" }, "TSEnumDeclaration"],
    },
    {
      name: "attribute path through null returns undefined (no match)",
      code: "let x;",
      options: [
        {
          selector: "VariableDeclarator[init.body='x']",
          message: "should not fire",
        },
      ],
    },
    {
      name: "selector traversing past Program root with > does not match",
      code: "const x = 1;",
      options: [
        {
          selector: "Identifier > Program > VariableDeclaration",
          message: "should not fire (Program has no parent)",
        },
      ],
    },
  ],
  invalid: [
    {
      name: "string-form selector matches type",
      code: "enum Foo { A, B }",
      options: ["TSEnumDeclaration"],
      errors: 1,
    },
    {
      name: "object-form selector with custom message",
      code: "enum Foo { A }",
      options: [{ selector: "TSEnumDeclaration", message: "no enum" }],
      errors: [{ message: "no enum" }],
    },
    {
      name: "child combinator: top-level arrow",
      code: "const f = (x: number) => x;",
      options: [
        {
          selector:
            "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "no top-level arrow",
        },
      ],
      errors: [{ message: "no top-level arrow" }],
    },
    {
      name: "child combinator: exported top-level arrow",
      code: "export const f = (x: number) => x;",
      options: [
        {
          selector:
            "Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "no exported arrow",
        },
      ],
      errors: [{ message: "no exported arrow" }],
    },
    {
      name: "descendant combinator (space) matches any depth",
      code: "function outer() { if (true) { const inner = (y: number) => y; } }",
      options: [
        {
          selector:
            "FunctionDeclaration VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "no arrow inside fn",
        },
      ],
      errors: [{ message: "no arrow inside fn" }],
    },
    {
      name: "comma union reports each branch separately",
      code: "enum E { A } interface I { x: number }",
      options: [
        {
          selector: "TSEnumDeclaration, TSInterfaceDeclaration",
          message: "banned construct",
        },
      ],
      errors: [
        { message: "banned construct" },
        { message: "banned construct" },
      ],
    },
    {
      name: "regex attribute matches",
      code: "import { _internal } from 'mod';",
      options: [
        {
          selector: "ImportSpecifier[imported.name=/^_/]",
          message: "no underscore imports",
        },
      ],
      errors: [{ message: "no underscore imports" }],
    },
    {
      name: "multiple options report independently",
      code: "enum E { A } const x = 1;",
      options: [
        { selector: "TSEnumDeclaration", message: "no enum" },
        { selector: "VariableDeclaration", message: "no var" },
      ],
      errors: [{ message: "no enum" }, { message: "no var" }],
    },
    {
      name: ":exit suffix fires on the same node",
      code: "const x = 1;",
      options: [
        { selector: "VariableDeclaration:exit", message: "exit fired" },
      ],
      errors: [{ message: "exit fired" }],
    },
    {
      name: ":exit with attributes after brackets",
      code: "const f = (x: number) => x;",
      options: [
        {
          selector:
            "VariableDeclarator[init.type='ArrowFunctionExpression']:exit",
          message: "exit on arrow",
        },
      ],
      errors: [{ message: "exit on arrow" }],
    },
    {
      name: "two configs sharing rightmost type both fire",
      code: "const x = 1; let y = 2;",
      options: [
        { selector: "VariableDeclaration[kind='const']", message: "no const" },
        { selector: "VariableDeclaration[kind='let']", message: "no let" },
      ],
      errors: [{ message: "no const" }, { message: "no let" }],
    },
    {
      name: "attribute existence check (no =)",
      code: "const x = 1;",
      options: [
        {
          selector: "VariableDeclarator[init]",
          message: "no initialized declarator",
        },
      ],
      errors: [{ message: "no initialized declarator" }],
    },
    {
      name: "boolean literal attribute matches",
      code: "React.useEffect(() => {}, []);",
      options: [
        {
          selector: "MemberExpression[computed=false]",
          message: "no static member access",
        },
      ],
      errors: [{ message: "no static member access" }],
    },
    {
      name: "boolean true literal matches computed access",
      code: "obj['x'];",
      options: [
        {
          selector: "MemberExpression[computed=true]",
          message: "no computed access",
        },
      ],
      errors: [{ message: "no computed access" }],
    },
    {
      name: "null literal attribute matches uninitialized declarator",
      code: "let x;",
      options: [
        {
          selector: "VariableDeclarator[init=null]",
          message: "no uninit",
        },
      ],
      errors: [{ message: "no uninit" }],
    },
    {
      name: "number literal attribute matches numeric value",
      code: "const x = 42;",
      options: [{ selector: "Literal[value=42]", message: "no 42" }],
      errors: [{ message: "no 42" }],
    },
    {
      name: "bare-word literal compared as string",
      code: "foo;",
      options: [{ selector: "Identifier[name=foo]", message: "no foo" }],
      errors: [{ message: "no foo" }],
    },
    {
      name: "double-quoted attribute literal matches",
      code: "foo;",
      options: [{ selector: 'Identifier[name="foo"]', message: "no foo (dq)" }],
      errors: [{ message: "no foo (dq)" }],
    },
    {
      name: "object-form selector without message uses default message",
      code: "enum E { A }",
      options: [{ selector: "TSEnumDeclaration" }],
      errors: [{ message: /TSEnumDeclaration/u }],
    },
    {
      name: "leading combinator (empty flush) is silently parsed",
      code: "let x = 1;",
      options: [{ selector: "> VariableDeclaration", message: "no var" }],
      errors: [{ message: "no var" }],
    },
  ],
});

describe("custom-rules/no-restricted-syntax (config-time errors)", () => {
  const fakeContext = (options: readonly unknown[]): Context =>
    ({
      options,
      report: () => {},
    }) as unknown as Context;

  const create = (options: readonly unknown[]) => {
    const rule = noRestrictedSyntax as { create: (c: Context) => unknown };
    return () => rule.create(fakeContext(options));
  };

  it("throws when `:exit` appears on a non-rightmost compound", () => {
    expect(create([{ selector: "Foo:exit > Bar", message: "x" }])).toThrow(
      /`:exit` is only allowed/u,
    );
  });

  it("throws on unclosed [", () => {
    expect(create([{ selector: "Foo[bar=1", message: "x" }])).toThrow(
      /Unclosed \[/u,
    );
  });

  it("throws when a compound has no type name", () => {
    expect(create([{ selector: "[name='x']", message: "x" }])).toThrow(
      /missing type name/u,
    );
  });

  it("throws when a compound has trailing chars after ]", () => {
    expect(create([{ selector: "Foo[a=1]bar", message: "x" }])).toThrow(
      /Invalid selector compound/u,
    );
  });
});
