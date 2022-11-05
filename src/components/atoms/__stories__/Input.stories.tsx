import React from 'react';
import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Input from '../Input';

export default {
  title: 'atoms/Input',
  component: Input,
  argTypes: {
    type: {
      options: ['text', 'password', 'search', 'number', 'url', 'tel', 'email'],
      control: {
        type: 'radio',
      },
    },
  },
  decorators: [
    (Story) => (
      <form onSubmit={(e) => e.preventDefault()}>
        <Story />
      </form>
    ),
  ],
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: faker.lorem.word(),
  disabled: false,
  readOnly: false,
  $isSuccess: false,
  $isError: false,
  $isWarning: false,
  type: 'text',
  id: faker.datatype.string(),
};
