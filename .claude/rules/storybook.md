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
  argTypes: {
    variant: {
      options: ["default", "secondary"],
      control: { type: "inline-radio" },
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta; // default export allowed only in story files
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {};

// Interaction test (Playwright-based)
export const ClickTest: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
```

## Custom Hook Story

Use `render` function to demo hook behavior:

```typescript
const meta = {
  render: () => {
    const { value, action } = useCustomHook();
    return <div>...</div>;
  },
} satisfies Meta<typeof useCustomHook>;
```

## MCP Integration

`@storybook/addon-mcp` is enabled with `dev` and `docs` toolsets. Use the `storybook-mcp` MCP server for:

- `get_ui_building_instructions` — get component building guidance
- `preview-stories` — preview stories
- `get-documentation` — query Storybook docs

## Key Points

- Import types from `@storybook/nextjs-vite` (NOT `@storybook/react`)
- Import test utils from `storybook/test` (NOT `@storybook/testing-library`)
- Use `satisfies Meta<typeof Component>` for type safety
- Interaction tests use `play` function with `canvas` and `userEvent`
