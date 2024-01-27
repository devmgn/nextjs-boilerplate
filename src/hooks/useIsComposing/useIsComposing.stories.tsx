import { Flex, Input, Stack, Tag, Text } from '@yamada-ui/react';
import { useIsComposing } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useIsComposing> = {
  title: 'hooks/useIsComposing',
  parameters: {
    layout: 'centered',
  },
  render: () => {
    const isComposing = useIsComposing();

    return (
      <Stack gap="4">
        <Input />
        <Flex alignItems="center" gap="2">
          <Text>isComposing</Text>
          <Tag colorScheme={isComposing ? 'red' : 'primary'}>
            {isComposing.toString()}
          </Tag>
        </Flex>
      </Stack>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useIsComposing>;

export const Default: Story = {};
