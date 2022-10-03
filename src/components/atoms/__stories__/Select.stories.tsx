import React from 'react';
import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Select from '../Select';

export default {
  title: 'atoms/Select',
  component: Select,
  decorators: [
    (Story) => (
      <form onSubmit={(e) => e.preventDefault()}>
        <Story />
      </form>
    ),
  ],
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  isSuccess: false,
  isError: false,
  isWarning: false,
  defaultValue: '',
  id: faker.datatype.string(),
  options: [
    {
      label: faker.lorem.word(),
      disabled: true,
    },
    ...faker.datatype
      .array(Number(faker.random.numeric()))
      .reduce<React.ComponentProps<typeof Select>['options']>(
        (prev, option) => [...prev, { label: faker.lorem.slug(), value: option }],
        []
      ),
  ],
};
