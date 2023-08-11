import { useRef } from 'react';
import Typography from '@/components/Typography';
import useIsComposing from '../useIsComposing';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useIsComposing> = {
  title: 'hooks/useIsComposing',
  render: () => {
    const ref = useRef(null);
    const isComposing = useIsComposing(ref);

    return (
      <>
        <Typography>isComposing: {isComposing.toString()}</Typography>
        <input
          type="text"
          ref={ref}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ddd',
            background: '#fff',
            marginTop: 16,
          }}
        />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useIsComposing>;

export const Default: Story = {};
