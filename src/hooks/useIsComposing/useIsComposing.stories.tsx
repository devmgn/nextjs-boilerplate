import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../components/Input";
import { useIsComposing } from ".";

const meta: Meta<typeof useIsComposing> = {
  title: "hooks/useIsComposing",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const isComposing = useIsComposing();

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p>isComposing</p>
          <p className="rounded border border-gray-800 px-1 py-0.5 text-sm">
            {isComposing.toString()}
          </p>
        </div>
        <Input />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useIsComposing>;

export const Default: Story = {};
