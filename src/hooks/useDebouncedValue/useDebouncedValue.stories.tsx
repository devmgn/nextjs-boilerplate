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
          onChange={setValue}
          placeholder="input value"
          type="text"
          value={value}
        />
        <div className="grid grid-cols-[1fr,auto] items-center gap-2">
          <p>debouncedValue Result:</p>
          <Input readOnly value={debouncedValue} />
          <p>delay:</p>
          <Input
            onChange={setDelay}
            placeholder="delay time"
            type="number"
            value={delay}
          />
        </div>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
