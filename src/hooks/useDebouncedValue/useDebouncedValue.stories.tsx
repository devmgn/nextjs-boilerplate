import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useDebouncedValue } from ".";
import { Input } from "../../components/Input";

const meta: Meta<typeof useDebouncedValue> = {
  title: "hooks/useDebouncedValue",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const [form, fields] = useForm<{
      input: string;
      delay: number;
    }>({
      defaultValue: { delay: 250 },
    });

    const debouncedValue = useDebouncedValue(
      form.value?.input ?? "",
      Number(form.value?.delay),
    );

    return (
      <form className="flex flex-col gap-4" {...getFormProps(form)}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <p>debouncedValue Result: </p>
          <Input readOnly={true} value={debouncedValue} />
          <p>delay</p>
          <Input
            placeholder="delay time"
            {...getInputProps(fields.delay, { type: "number" })}
          />
        </div>
        <Input
          placeholder="input value"
          {...getInputProps(fields.input, { type: "text" })}
        />
      </form>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
