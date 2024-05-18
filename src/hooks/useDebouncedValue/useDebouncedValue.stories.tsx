import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useDebouncedValue> = {
  title: 'hooks/useDebouncedValue',
  parameters: {
    layout: 'centered',
  },
  render: () => {
    const [delay, setDelay] = useState('150');
    const [value, setValue] = useState('');
    const debouncedValue = useDebouncedValue(value, Number(delay));

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr,auto] items-center gap-2">
          <p>debouncedValue Result:</p>
          <Input readOnly value={debouncedValue} />
          <p>delay:</p>
          <Input
            onChange={(e) => {
              setDelay(e.target.value);
            }}
            placeholder="delay time"
            type="number"
            value={delay}
          />
        </div>
        <Input
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="input value"
          type="text"
          value={value}
        />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
