import useDebouncedValue from '../useDebouncedValue';
import useInputValue from '../useInputValue';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useDebouncedValue> = {
  title: 'hooks/useDebouncedValue',
  render: () => {
    const [delay, setDelay] = useInputValue('100');
    const [value, setValue] = useInputValue('');
    const debouncedValue = useDebouncedValue(value, Number(delay));

    return (
      <>
        <div>
          <div>
            <p>debouncedValue:</p>
            <input type="text" value={debouncedValue} readOnly />
          </div>
          <input type="text" value={value} onChange={setValue} />
        </div>
        <div>
          <h2>Option</h2>
          <div>
            <p>delay:</p>
            <input type="number" value={delay} onChange={setDelay} />
          </div>
        </div>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
