import { Table, TextArea, TextField } from '@radix-ui/themes';
import useResizeObserver from '../useResizeObserver';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof useResizeObserver> = {
  title: 'hooks/useResizeObserver',
  render: () => {
    const [rect, ref] = useResizeObserver<HTMLTextAreaElement>();

    return (
      <>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              {Object.keys(rect.toJSON()).map((key) => (
                <Table.ColumnHeaderCell key={key}>
                  rect.{key}
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries<number>(rect.toJSON()).map(([key, value]) => (
              <Table.ColumnHeaderCell key={key}>
                <TextField.Input type="text" value={value} readOnly />
              </Table.ColumnHeaderCell>
            ))}
          </Table.Body>
        </Table.Root>
        <TextArea
          ref={ref}
          readOnly
          mt="3"
          style={{ minHeight: 'auto', resize: 'both' }}
        />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useResizeObserver>;

export const Default: Story = {};
