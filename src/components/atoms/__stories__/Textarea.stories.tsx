import { ComponentMeta, ComponentStory } from '@storybook/react';
import Textarea from '../Textarea';

export default {
  title: 'atoms/Textarea',
  component: Textarea,
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args) => <Textarea {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: '入力してください',
  disabled: false,
  readOnly: false,
  isError: false,
  isWarning: false,
  rows: 1,
};
