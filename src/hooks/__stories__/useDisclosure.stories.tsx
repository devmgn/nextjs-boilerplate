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
        <div>
          <div>
            <p>isOpen</p>
            <input type="text" value={isOpen.toString()} readOnly />
          </div>
        </div>
        <div>
          <button onClick={open} type="button">
            OPEN
          </button>
          <button onClick={close} type="button">
            CLOSE
          </button>
          <button onClick={toggle} type="button">
            TOGGLE
          </button>
        </div>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDisclosure>;

export const Default: Story = {};
