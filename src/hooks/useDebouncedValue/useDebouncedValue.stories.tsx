import { useState } from 'react';
import { Grid, Input, NumberInput, Stack, Text } from '@yamada-ui/react';
import { useInputValue } from '../useInputValue/useInputValue';
import { useDebouncedValue } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useDebouncedValue> = {
  title: 'hooks/useDebouncedValue',
  parameters: {
    layout: 'centered',
  },
  render: () => {
    const [delay, setDelay] = useState(150);
    const [value, setValue] = useInputValue();
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
          <Text>debouncedValue Result:</Text>
          <Input value={debouncedValue} readOnly />
          <Text>delay:</Text>
          <NumberInput
            value={delay}
            onChange={(_, v) => setDelay(v)}
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
