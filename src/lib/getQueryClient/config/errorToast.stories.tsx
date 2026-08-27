import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { expect, screen, waitFor } from "storybook/test";
import { Button } from "../../../components/Button";

const ERROR_MESSAGE = "サーバーエラーが発生しました";
const ERROR_STATE_LABEL = "クエリはエラー状態です";

function ErrorToastDemo(props: { skipToast?: boolean }) {
  const { skipToast } = props;
  const { isError, refetch } = useQuery({
    queryKey: ["error-toast-demo", skipToast],
    queryFn: () => {
      throw new Error(ERROR_MESSAGE);
    },
    enabled: false,
    retry: false,
    meta: skipToast === true ? { skipToast: true } : undefined,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => {
          void refetch();
        }}
      >
        {skipToast === true ? "エラー発生 (トースト抑制)" : "エラー発生"}
      </Button>
      {isError && <p>{ERROR_STATE_LABEL}</p>}
    </div>
  );
}

const meta = {
  component: ErrorToastDemo,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
    docs: { story: { inline: false } },
  },
  argTypes: {
    skipToast: {
      control: { type: "boolean" },
    },
  },
  // sonner のトーストはモジュールレベルで保持され story を跨いで残るため、毎回破棄してから開始する
  beforeEach: async () => {
    toast.dismiss();
    await waitFor(async () => {
      await expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
    });
  },
} satisfies Meta<typeof ErrorToastDemo>;

export default meta;
type Story = StoryObj<typeof ErrorToastDemo>;

export const Default: Story = {
  tags: ["!manifest"],
  play: async ({ canvas }) => {
    canvas.getByRole("button", { name: "エラー発生" }).click();

    await waitFor(async () => {
      await expect(screen.getByText(ERROR_MESSAGE)).toBeVisible();
    });
  },
};

export const SkipToast: Story = {
  args: { skipToast: true },
  play: async ({ canvas }) => {
    canvas.getByRole("button", { name: "エラー発生 (トースト抑制)" }).click();

    // クエリがエラーになったことを確認してからトーストの不在を検証する
    await expect(await canvas.findByText(ERROR_STATE_LABEL)).toBeVisible();
    await expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
  },
};
