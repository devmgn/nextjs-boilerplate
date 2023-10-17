import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import useDisclosure from '../useDisclosure';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useDisclosure> = {
  title: 'hooks/useDisclosure',
  render: () => {
    const [isOpen, { open, close, toggle }] = useDisclosure(false, {
      onOpen() {
        console.log('onOpen');
      },
      onClose() {
        console.log('onClose');
      },
    });

    return (
      <>
        <Flex gap="2" direction="column">
          <Flex align="center" gap="2">
            <Text>isOpen</Text>
            <TextField.Input type="text" value={isOpen.toString()} readOnly />
          </Flex>
        </Flex>
        <Flex gap="2" mt="6">
          <Button onClick={open}>OPEN</Button>
          <Button onClick={close}>CLOSE</Button>
          <Button onClick={toggle}>TOGGLE</Button>
        </Flex>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDisclosure>;

export const Default: Story = {};
