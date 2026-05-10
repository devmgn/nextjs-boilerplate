import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMutation } from "@tanstack/react-query";
import { expect, screen, waitFor } from "storybook/test";
import { Button } from "../../components/Button";
import { LoadingOverlay, loading } from "../../components/LoadingOverlay";

function MutationLoadingDemo(props: { skipLoading?: boolean }) {
  const { skipLoading } = props;
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
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
    // Docs ページで複数 story が同 iframe に同居すると loadingStore (module singleton) が共有され、
    // 各 story の mutation がカウンタを積み上げてしまう。iframe 隔離で独立させる。
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
    // skipLoading: true の mutation では Spinner が出ない
    await expect(screen.queryByRole("status")).toBeNull();
  },
};
