import { useId } from "react";
import { Input } from "../../components/Input";
import { useIsComposing } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof useIsComposing> = {
  title: "hooks/useIsComposing",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const isComposing = useIsComposing();
    const id = useId();

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p>isComposing</p>
          <p className="rounded border border-gray-800 px-1 py-0.5 text-sm">
            {isComposing.toString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={id}>your text</label>
          <Input id={id} />
        </div>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useIsComposing>;

export const Default: Story = {};
