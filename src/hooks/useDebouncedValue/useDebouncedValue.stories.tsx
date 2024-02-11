import { Input } from '@/components/ui/input';
import { useInputValue } from '../useInputValue/useInputValue';
import { useDebouncedValue } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useDebouncedValue> = {
  title: 'hooks/useDebouncedValue',
  parameters: {
    layout: 'centered',
  },
  render: () => {
    const [delay, setDelay] = useInputValue(150);
    const [value, setValue] = useInputValue();
    const debouncedValue = useDebouncedValue(value, Number(delay));

    return (
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          value={value}
          onChange={setValue}
          placeholder="input value"
        />
        <div className="grid items-center gap-2 grid-cols-[1fr,auto]">
          <p>debouncedValue Result:</p>
          <Input value={debouncedValue} readOnly />
          <p>delay:</p>
          <Input
            type="number"
            value={delay}
            onChange={setDelay}
            placeholder="delay time"
          />
        </div>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
