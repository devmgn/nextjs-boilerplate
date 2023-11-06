import useResizeObserver from '../useResizeObserver';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useResizeObserver> = {
  title: 'hooks/useResizeObserver',
  render: () => {
    const [rect, ref] = useResizeObserver<HTMLTextAreaElement>();

    return (
      <>
        <table>
          <thead>
            <tr>
              {Object.keys(rect.toJSON()).map((key) => (
                <th key={key}>rect.{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries<number>(rect.toJSON()).map(([key, value]) => (
              <td key={key}>
                <input type="text" value={value} readOnly />
              </td>
            ))}
          </tbody>
        </table>
        <textarea
          ref={ref}
          readOnly
          style={{ minHeight: 'auto', resize: 'both' }}
        />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useResizeObserver>;

export const Default: Story = {};
