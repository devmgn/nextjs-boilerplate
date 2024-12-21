import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { useDebouncedValue } from ".";
import { Input } from "../../components/ui/input";

const meta: Meta<typeof useDebouncedValue> = {
  title: "hooks/useDebouncedValue",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const { register, watch } = useForm<{
      input: string;
      delay: number;
    }>({
      defaultValues: { input: "", delay: 150 },
    });

    const debouncedValue = useDebouncedValue(
      watch("input") || "",
      watch("delay"),
    );

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <p>debouncedValue Result: </p>
          <Input readOnly={true} value={debouncedValue} />
          <p>delay</p>
          <Input
            placeholder="delay time"
            type="number"
            {...register("delay", { valueAsNumber: true })}
          />
        </div>
        <Input placeholder="input value" type="text" {...register("input")} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
