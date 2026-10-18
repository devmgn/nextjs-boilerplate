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
 * Delays invoking `func` until `wait` milliseconds have passed since the last
 * call.
 *
 * @typeParam Args - Argument types of `func`
 * @param func - The function to debounce
 * @param wait - Delay in milliseconds
 * @returns The debounced function, with `cancel` / `flush`
 */
```

- `@param name - description` — the hyphen is required
- No `{type}` annotations on `@param` / `@returns`; TypeScript already has the types
- `@typeParam`, not `@template`
- Other TSDoc tags: `@remarks`, `@defaultValue`, `@example`, `@see`, `@deprecated`, `@privateRemarks`
- Write descriptions in English. Describe meaning and behavior, not the types

## Escaping

`>`, `{`, `}` and `@` in prose break `tsdoc/syntax`.

- Prefer backticks (`` `count > 0` ``). In a single-line `/** ... */` comment, oxfmt strips a `\` escape and the error comes back
- If the code span is long enough that oxfmt wraps it across lines (which breaks the span), use a multi-line block and escape with `\` instead (`\{ name: "x" \}`)
