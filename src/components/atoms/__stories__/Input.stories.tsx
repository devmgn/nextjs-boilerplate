import { ComponentMeta, ComponentStory } from '@storybook/react';
import Input from '../Input';

export default {
  title: 'atoms/Input',
  component: Input,
  argTypes: {
    type: {
      control: {
        type: 'radio',
        options: ['text', 'password', 'search', 'number', 'url', 'tel', 'email'],
      },
    },
  },
} as ComponentMeta<typeof Input>;
const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: '入力してください',
  disabled: false,
  readOnly: false,
  isError: false,
  isWarning: false,
};
