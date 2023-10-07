import { Flex, Text, TextField } from '@radix-ui/themes';
import useIsComposing from '../useIsComposing';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useIsComposing> = {
  title: 'hooks/useIsComposing',
  render: () => {
    const isComposing = useIsComposing();

    return (
      <>
        <Flex gap="2" direction="column">
          <Flex align="center" gap="2">
            <Text>isComposing</Text>
            <TextField.Input
              type="text"
              value={isComposing.toString()}
              readOnly
            />
          </Flex>
        </Flex>
        <TextField.Input type="text" mt="4" />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useIsComposing>;

export const Default: Story = {};
