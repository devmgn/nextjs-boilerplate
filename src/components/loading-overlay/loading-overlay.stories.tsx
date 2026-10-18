import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, waitFor } from "storybook/test";
import { LoadingOverlay, LoadingScreen, loading } from ".";
import { delay } from "../../utils/delay";
import { Button } from "../button";

const meta = {
  component: LoadingOverlay,
  parameters: {
    docs: { story: { inline: false } },
  },
  decorators: [
    (story) => (
      <div className="relative h-50 w-full">
        <p>背景コンテンツ。LoadingOverlay の後ろに表示されます。</p>
        {story()}
        {/*
         * Dialog modal=true sets pointer-events: none on body, so restore auto here and
         * stack above Overlay (z-40) / Content (z-50) with a higher z-index.
         */}
        <div className="pointer-events-auto fixed top-10 left-2 z-[60] flex gap-2">
          <Button
            onClick={() => {
              loading.show();
            }}
          >
            Show
          </Button>
          <Button
            onClick={() => {
              loading.hide();
            }}
          >
            Hide
          </Button>
          <Button
            onClick={() => {
              loading.reset();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof LoadingOverlay>;

export default meta;

type Story = StoryObj<typeof LoadingOverlay>;

async function waitForOverlayClosed(): Promise<void> {
  await waitFor(async () => {
    await expect(screen.queryByRole("status")).toBeNull();
  });
}

function getSpinner(): HTMLElement {
  return screen.getByRole("status");
}

function getDialog(): HTMLElement {
  return screen.getByRole("dialog");
}

/**
 * Shows the initial (hidden) state; try the behavior manually with the
 * decorator's Show/Hide buttons.
 */
export const Default: Story = {
  play: () => {
    loading.reset();
  },
};

/**
 * Minimal show → hide pair verifying visibility and the Dialog's accessible
 * name (DialogTitle).
 */
export const Shown: Story = {
  play: async () => {
    loading.reset();
    loading.show();

    await waitFor(() => getSpinner());
    await expect(getDialog()).toHaveAccessibleName("Loading");

    loading.hide();
    await waitForOverlayClosed();
  },
};

/**
 * Reference counting: after two shows, one hide keeps it visible and a second
 * hide closes it.
 */
export const RefCounted: Story = {
  play: async () => {
    loading.reset();
    loading.show();
    loading.show();

    await waitFor(async () => {
      await expect(getSpinner()).toBeVisible();
    });

    loading.hide();
    // One hide is not enough: Spinner is still in the DOM
    await expect(getSpinner()).toBeInTheDocument();

    loading.hide();
    await waitForOverlayClosed();
  },
};

/**
 * Verifies that Loading.promise(p) pairs show/hide and passes through the
 * original promise's resolved value.
 */
export const PromiseResolved: Story = {
  play: async () => {
    loading.reset();

    const task = loading.promise(
      (async () => {
        await delay(80);

        return "done";
      })()
    );

    await waitFor(() => getSpinner());

    const result = await task;
    await expect(result).toBe("done");
    await waitForOverlayClosed();
  },
};

/**
 * Verifies that reset() drops the counter to 0 and closes immediately, even
 * when it has stacked up.
 */
export const ResetDuringShow: Story = {
  play: async () => {
    loading.reset();
    loading.show();
    loading.show();
    loading.show();

    await waitFor(() => getSpinner());

    loading.reset();
    await waitForOverlayClosed();
  },
};

/**
 * Declarative API: LoadingScreen stays visible while mounted (for Suspense
 * fallbacks).
 */
export const Declarative: StoryObj<typeof LoadingScreen> = {
  render: () => <LoadingScreen />,
  play: async () => {
    await waitFor(async () => {
      await expect(getSpinner()).toBeVisible();
    });
    await expect(getDialog()).toHaveAccessibleName("Loading");
  },
};
