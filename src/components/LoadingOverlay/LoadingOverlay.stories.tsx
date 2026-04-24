import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { LoadingOverlay, loading } from "./LoadingOverlay";
import { LoadingScreen } from "./LoadingScreen";
import { Button } from "../Button";

const meta = {
  component: LoadingOverlay,
  decorators: [
    (story) => (
      <div className="relative h-50 w-full">
        <p>背景コンテンツ。LoadingOverlay の後ろに表示されます。</p>
        {story()}
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
      </div>
    ),
  ],
} satisfies Meta<typeof LoadingOverlay>;

export default meta;

type Story = StoryObj<typeof LoadingOverlay>;

async function waitForOverlayClosed(canvas: HTMLElement): Promise<void> {
  await waitFor(async () => {
    const spinner = within(canvas).queryByRole("status");
    if (spinner) {
      const container = spinner.closest<HTMLElement>("[data-state]");
      await expect(container).toHaveAttribute("data-state", "closed");
    }
  });
}

function getSpinner(canvas: HTMLElement): HTMLElement {
  return within(canvas).getByRole("status");
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    loading.reset();
    await waitForOverlayClosed(canvasElement);
  },
};

export const Shown: Story = {
  play: async ({ canvasElement }) => {
    loading.reset();
    loading.show();

    const spinner = await waitFor(() => getSpinner(canvasElement));
    await expect(spinner).toHaveAccessibleName("Loading");

    loading.hide();
    await waitForOverlayClosed(canvasElement);
  },
};

export const RefCounted: Story = {
  play: async ({ canvasElement }) => {
    loading.reset();
    loading.show();
    loading.show();

    await waitFor(async () => {
      await expect(getSpinner(canvasElement)).toBeVisible();
    });

    loading.hide();
    // hide 1 回では消えない: Spinner がまだ DOM にある
    await expect(getSpinner(canvasElement)).toBeInTheDocument();

    loading.hide();
    await waitForOverlayClosed(canvasElement);
  },
};

export const PromiseResolved: Story = {
  play: async ({ canvasElement }) => {
    loading.reset();
    const task = loading.promise(
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve("done");
        }, 80);
      }),
    );

    await waitFor(() => getSpinner(canvasElement));

    const result = await task;
    await expect(result).toBe("done");
    await waitForOverlayClosed(canvasElement);
  },
};

export const ResetDuringShow: Story = {
  play: async ({ canvasElement }) => {
    loading.reset();
    loading.show();
    loading.show();
    loading.show();

    await waitFor(() => getSpinner(canvasElement));

    loading.reset();
    await waitForOverlayClosed(canvasElement);
  },
};

export const Declarative: StoryObj<typeof LoadingScreen> = {
  render: () => <LoadingScreen />,
  play: async ({ canvasElement }) => {
    await waitFor(async () => {
      await expect(getSpinner(canvasElement)).toBeVisible();
    });
    await expect(getSpinner(canvasElement)).toHaveAccessibleName("Loading");
  },
};
