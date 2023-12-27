import { useState } from 'react';
import { Grid, Input, NumberInput, Stack, Text } from '@yamada-ui/react';
import { useDebouncedValue } from '../useDebouncedValue';
import { useInputValue } from '../useInputValue';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useDebouncedValue> = {
  title: 'hooks/useDebouncedValue',
  parameters: {
    layout: 'centered',
  },
  render: () => {
    const [delay, setDelay] = useState('100');
    const [value, setValue] = useInputValue('');
    const debouncedValue = useDebouncedValue(value, Number(delay));

    return (
      <Stack gap="4">
        <Input
          type="text"
          value={value}
          onChange={setValue}
          placeholder="input value"
        />
        <Grid alignItems="center" gap="2" gridTemplateColumns="auto auto">
          <Text>debouncedValue:</Text>
          <Input
            value={debouncedValue}
            placeholder="debounced value"
            readOnly
          />
          <Text>delay:</Text>
          <NumberInput
            value={delay}
            onChange={setDelay}
            placeholder="delay time"
          />
        </Grid>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
