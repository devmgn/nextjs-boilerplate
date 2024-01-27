import { Grid, Input, Stack, Text } from '@yamada-ui/react';
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
      <Stack gap="4">
        <Input
          type="text"
          value={value}
          onChange={setValue}
          placeholder="input value"
        />
        <Grid alignItems="center" gap="2" gridTemplateColumns="auto auto">
          <Text>inputValue Result:</Text>
          <Input value={value} readOnly />
        </Grid>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useInputValue>;

export const Default: Story = {};
