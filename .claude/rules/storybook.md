---
paths:
  - "**/*.stories.tsx"
  - ".storybook/**"
---

# Storybook Rules

## Stack

- **Storybook 10** with `@storybook/nextjs-vite` framework
- Addons: a11y, docs, vitest, MCP (`@storybook/addon-mcp` with dev + docs toolsets)
- MSW integration enabled (mswLoader in preview)
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

Use `parameters.msw.handlers` with auto-generated or custom handlers. Set `inline: false` when stories for the same endpoint return different responses (required for Docs page MSW isolation).

```typescript
const meta = {
  component: PostList,
  parameters: {
    docs: { story: { inline: false } },
    msw: { handlers },
  },
} satisfies Meta<typeof PostList>;

export const ServerError: Story = {
  parameters: {
    docs: { story: { inline: false } },
    msw: {
      handlers: [
        http.get("https://...", () =>
          HttpResponse.json({ message: "Error" }, { status: 500 }),
        ),
      ],
    },
  },
};
```

## MCP Integration

Use `storybook-mcp` tools: `list-all-documentation`, `get-documentation`, `get-documentation-for-story`, `get-storybook-story-instructions`, `preview-stories`, `run-story-tests`.

**Never hallucinate component properties.** Always verify via `get-documentation` before using any property. Always run `get-storybook-story-instructions` before creating/updating stories. Check work with `run-story-tests`.

## Key Points

- Import types from `@storybook/nextjs-vite` (NOT `@storybook/react`)
- Import test utils from `storybook/test` (NOT `@storybook/testing-library`)
