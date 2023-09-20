import Typography from '@/components/Typography';
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
        <Typography>
          delay:
          <input
            type="number"
            value={delay}
            onChange={setDelay}
            style={{
              padding: 4,
              border: '1px solid #ddd',
              background: '#fff',
              marginLeft: 8,
            }}
          />
        </Typography>
        <Typography>debouncedValue: {debouncedValue.toString()}</Typography>
        <input
          type="text"
          value={value}
          onChange={setValue}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ddd',
            background: '#fff',
            marginTop: 16,
          }}
        />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
