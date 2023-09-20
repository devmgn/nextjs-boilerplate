import Typography from '@/components/Typography';
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
        <Typography>rect: {JSON.stringify(rect)}</Typography>
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useResizeObserver>;

export const Default: Story = {};
