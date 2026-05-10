import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, waitFor } from "storybook/test";
import { LoadingOverlay, LoadingScreen, loading } from ".";
import { Button } from "../Button";

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
         * Dialog modal=true は body に pointer-events: none を当てるため、
         * 子側で auto に戻し、Overlay (z-40) / Content (z-50) より上の z-index に重ねる。
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

/** 初期状態 (非表示) を見せ、decorator の Show/Hide ボタンから手動で挙動を試せるエントリ。 */
export const Default: Story = {
  play: () => {
    loading.reset();
  },
};

/** Show → hide の最小ペアで、表示・非表示と Dialog の accessible name (DialogTitle) を検証する。 */
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

/** 参照カウント仕様: show 2 回に対して hide 1 回ではまだ表示、もう 1 回で消えることを検証する。 */
export const RefCounted: Story = {
  play: async () => {
    loading.reset();
    loading.show();
    loading.show();

    await waitFor(async () => {
      await expect(getSpinner()).toBeVisible();
    });

    loading.hide();
    // hide 1 回では消えない: Spinner がまだ DOM にある
    await expect(getSpinner()).toBeInTheDocument();

    loading.hide();
    await waitForOverlayClosed();
  },
};

/** Loading.promise(p) が show/hide のペアを保証し、元 promise の解決値を透過することを検証する。 */
export const PromiseResolved: Story = {
  play: async () => {
    loading.reset();
    const task = loading.promise(
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve("done");
        }, 80);
      }),
    );

    await waitFor(() => getSpinner());

    const result = await task;
    await expect(result).toBe("done");
    await waitForOverlayClosed();
  },
};

/** カウンタが積み上がっている状態でも reset() で即 0 にして閉じられることを検証する。 */
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

/** 宣言的 API: LoadingScreen はマウントされている間ずっと表示される (Suspense fallback 用途)。 */
export const Declarative: StoryObj<typeof LoadingScreen> = {
  render: () => <LoadingScreen />,
  play: async () => {
    await waitFor(async () => {
      await expect(getSpinner()).toBeVisible();
    });
    await expect(getDialog()).toHaveAccessibleName("Loading");
  },
};
