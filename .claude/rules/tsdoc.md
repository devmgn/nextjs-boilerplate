---
paths:
  - "**/*.{ts,tsx,mts,cts}"
---

# TSDoc Rules

Oxlint enforces doc comments through Ultracite's `jsdoc-js` and `tsdoc` js-plugins (`jsdoc-js/require-jsdoc`, `jsdoc/require-param`, `jsdoc/require-returns`, `tsdoc/syntax`).

## What needs a doc comment

- Every exported function, class (and its public methods), type alias, interface, enum, and exported arrow / function expression — including Next.js convention files (`page.tsx`, `layout.tsx`, `error.tsx`, `sitemap.ts`, ...)
- Any function that has a doc comment, exported or not, must document every parameter (`@param`) and its return value (`@returns`). Destructured parameters are documented as a whole (`@param props - ...`), not per property

## Syntax (TSDoc, not JSDoc)

```ts
/**
 * 最後の呼び出しから `wait` ミリ秒経過するまで `func` の実行を遅延させる。
 *
 * @typeParam Args - `func` の引数の型
 * @param func - 遅延実行する関数
 * @param wait - 遅延時間 (ミリ秒)
 * @returns `cancel` / `flush` を持つ debounce 済み関数
 */
```

- `@param name - description` — the hyphen is required
- No `{type}` annotations on `@param` / `@returns`; TypeScript already has the types
- `@typeParam`, not `@template`
- Other TSDoc tags: `@remarks`, `@defaultValue`, `@example`, `@see`, `@deprecated`, `@privateRemarks`
- Write descriptions in Japanese, matching the existing comments. Describe meaning and behavior, not the types

## Escaping

`>`, `{`, `}` and `@` in prose break `tsdoc/syntax`.

- Prefer backticks (`` `count > 0` ``). In a single-line `/** ... */` comment, oxfmt strips a `\` escape and the error comes back
- If the code span is long enough that oxfmt wraps it across lines (which breaks the span), use a multi-line block and escape with `\` instead (`\{ name: "x" \}`)
