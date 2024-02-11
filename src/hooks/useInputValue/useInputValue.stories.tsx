import { Input } from '@/components/ui/input';
import { useInputValue } from './useInputValue';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useInputValue> = {
  title: 'hooks/useInputValue',
  parameters: {
    layout: 'centered',
  },
  render: () => {
    const [value, setValue] = useInputValue();

    return (
      <div className="flex flex-col gap-4">
        <Input
          onChange={setValue}
          placeholder="input value"
          type="text"
          value={value}
        />
        <div className="grid grid-cols-[1fr,auto] items-center gap-2">
          <p>inputValue Result:</p>
          <Input readOnly value={value} />
        </div>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useInputValue>;

export const Default: Story = {};
