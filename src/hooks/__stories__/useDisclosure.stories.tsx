import Typography from '@/components/Typography';
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
        <Typography>isOpen: {isOpen.toString()}</Typography>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            style={{ border: '1px solid grey', padding: 8 }}
            type="button"
            onClick={open}
          >
            open
          </button>
          <button
            style={{ border: '1px solid grey', padding: 8 }}
            type="button"
            onClick={close}
          >
            close
          </button>
          <button
            style={{ border: '1px solid grey', padding: 8 }}
            type="button"
            onClick={toggle}
          >
            toggle
          </button>
        </div>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDisclosure>;

export const Default: Story = {};
