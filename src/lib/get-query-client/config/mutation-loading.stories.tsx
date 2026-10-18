import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMutation } from "@tanstack/react-query";
import { expect, screen, waitFor } from "storybook/test";
import { Button } from "../../../components/button";
import { LoadingOverlay, loading } from "../../../components/loading-overlay";
import { delay } from "../../../utils/delay";

function MutationLoadingDemo(props: { skipLoading?: boolean }) {
  const { skipLoading } = props;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await delay(500);

      return "ok";
    },
    meta: skipLoading === true ? { skipLoading: true } : undefined,
  });

  return (
    <>
      <LoadingOverlay />
      <Button
        disabled={isPending}
        onClick={() => {
          mutate();
        }}
      >
        {skipLoading === true ? "Mutate (loading 抑制)" : "Mutate"}
      </Button>
    </>
  );
}

const meta = {
  component: MutationLoadingDemo,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
    // When multiple stories share one iframe on the Docs page, loadingStore (a module singleton) is shared
    // and each story's mutations pile up on the counter. Isolate them in separate iframes.
    docs: { story: { inline: false } },
  },
  argTypes: {
    skipLoading: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof MutationLoadingDemo>;

export default meta;

type Story = StoryObj<typeof MutationLoadingDemo>;

export const Default: Story = {
  play: async ({ canvas }) => {
    loading.reset();
    canvas.getByRole("button").click();

    await waitFor(async () => {
      await expect(screen.getByRole("status")).toBeVisible();
    });

    await waitFor(async () => {
      await expect(screen.queryByRole("status")).toBeNull();
    });
  },
};

export const SkipLoading: Story = {
  args: { skipLoading: true },
  play: async ({ canvas }) => {
    loading.reset();
    canvas.getByRole("button").click();
    // No Spinner appears for a mutation with skipLoading: true
    await expect(screen.queryByRole("status")).toBeNull();
  },
};
