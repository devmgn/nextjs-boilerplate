---
paths:
  - "**/*.stories.tsx"
  - ".storybook/**"
---

# Storybook Rules

## Stack

- **Storybook 10** with `@storybook/nextjs-vite` framework
- Addons: a11y, docs, vitest, MCP (`@storybook/addon-mcp`)
- MSW integration: `msw-storybook-addon` v3 — `loaders: [mswLoader()]` imported from `msw-storybook-addon/csf3` (CSF 3.0 path)
- a11y test mode: `"todo"` (shown in test UI only)
- Autodocs enabled via tags: `["autodocs"]`

## Story Pattern

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { ComponentName } from "./ComponentName";

const meta = {
  component: ComponentName,
  args: { onClick: fn() },
} satisfies Meta<typeof ComponentName>;

export default meta; // default export allowed only in story files
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {};
```

## MSW Story Pattern

Register handlers via `beforeEach({ msw })` + `msw.use()`. **Do NOT use `parameters.msw`** — it is deprecated in v3 (still resolved by the csf3 loader, but ignored entirely if the project moves to CSF Next).

`msw` is the `SetupWorker` instance. Its type comes from the `msw-storybook-addon/types` entry listed in `tsconfig.json` `compilerOptions.types` — without it `msw` degrades to `any`.

Set `inline: false` when stories for the same endpoint return different responses (required for Docs page MSW isolation — the worker is a singleton, so simultaneously inlined stories clobber each other's handlers).

```typescript
const meta = {
  component: PostList,
  parameters: {
    docs: { story: { inline: false } },
  },
  beforeEach({ msw }) {
    msw.use(...handlers);
  },
} satisfies Meta<typeof PostList>;

export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get("https://...", () =>
        HttpResponse.json({ message: "Error" }, { status: 500 }),
      ),
    );
  },
};
```

Execution order is `loaders` → `beforeEach` (project → meta → story), and the worker is reset at the start of each loader run. So a story's `msw.use()` always overrides the meta-level handlers.

Unhandled requests print `[MSW] Warning: intercepted a request without a matching request handler`. Storybook's internal requests (`@vite`, `sb-common-assets`, …) are excluded by the addon's default setup, so any warning is a real mock gap. Watch for it: a story without a play function still passes even when its mock never matched.

## MCP Integration

`@storybook/addon-mcp` serves the MCP endpoint at `http://localhost:6006/mcp`, registered as `storybook-mcp` in `.mcp.json`. Tools are grouped into toolsets, toggled via `toolsets` in `.storybook/main.ts` (each defaults to `true`).

| Toolset | Tool                               | Purpose                                                    |
| ------- | ---------------------------------- | ---------------------------------------------------------- |
| dev     | `stories-changed`                  | Stories affected by local file changes                     |
| dev     | `stories-find-by-component`        | Map component source files to the stories that render them |
| dev     | `get-storybook-story-instructions` | Story authoring and interaction test conventions           |
| dev     | `stories-preview`                  | Render story previews / return preview URLs                |
| dev     | `review-create`                    | Publish a curated review page                              |
| docs    | `docs-list`                        | Component index and documentation entries                  |
| docs    | `docs-show`                        | Component documentation with props and story samples       |
| docs    | `docs-show-story`                  | A single story with its documentation                      |
| test    | `test-run`                         | Run tests for the given stories, including a11y results    |

`review-create` is registered for direct MCP clients only when `features.experimentalReview` is on; the `storybook ai` CLI channel gets it by default.

The docs toolset needs a components manifest. `@storybook/nextjs-vite` emits one automatically, so the `features.componentsManifest` flag from the install docs is not required here.

### Workflow

1. **Never hallucinate component properties.** Resolve the component with `docs-list`, then verify every prop via `docs-show`. Never read props from source or type definitions.
2. Run `get-storybook-story-instructions` before creating or updating stories.
3. After changing anything that affects how the UI looks, surface it with `stories-preview`. A shared file has no stories of its own — preview the stories of the components that consume it.
4. Validate with `test-run`. Typecheck and lint do not replace story tests.

## Key Points

- Import types from `@storybook/nextjs-vite` (NOT `@storybook/react`)
- Import test utils from `storybook/test` (NOT `@storybook/testing-library`)
