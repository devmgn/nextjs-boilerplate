import { Text } from '@radix-ui/themes';
import useResizeObserver from '../useResizeObserver';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useResizeObserver> = {
  title: 'hooks/useResizeObserver',
  render: () => {
    const [rect, ref] = useResizeObserver<HTMLTextAreaElement>();

    return (
      <>
        <textarea
          ref={ref}
          style={{ border: '1px solid grey', resize: 'both' }}
        />
        <Text>rect: {JSON.stringify(rect)}</Text>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useResizeObserver>;

export const Default: Story = {};
