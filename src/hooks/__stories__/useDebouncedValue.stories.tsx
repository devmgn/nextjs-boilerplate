import { Flex, Heading, Text, TextField } from '@radix-ui/themes';
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
        <Flex gap="2" direction="column">
          <Flex align="center" gap="2">
            <Text>debouncedValue:</Text>
            <TextField.Input type="text" value={debouncedValue} readOnly />
          </Flex>
          <TextField.Input type="text" value={value} onChange={setValue} />
        </Flex>
        <Flex gap="2" direction="column" mt="6">
          <Heading size="3">Option</Heading>
          <Flex align="center" gap="2">
            <Text>delay:</Text>
            <TextField.Input type="number" value={delay} onChange={setDelay} />
          </Flex>
        </Flex>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
