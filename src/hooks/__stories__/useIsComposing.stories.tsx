import { useIsComposing } from '../useIsComposing';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useIsComposing> = {
  title: 'hooks/useIsComposing',
  render: () => {
    const isComposing = useIsComposing();

    return (
      <>
        <div>
          <div>
            <p>isComposing</p>
            <input type="text" value={isComposing.toString()} readOnly />
          </div>
        </div>
        <input type="text" />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useIsComposing>;

export const Default: Story = {};
