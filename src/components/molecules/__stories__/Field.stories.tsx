import { ComponentMeta, ComponentStory } from '@storybook/react';
import Field from '../Field';

export default {
  title: 'molecules/Field',
  component: Field,
} as ComponentMeta<typeof Field>;
const Template: ComponentStory<typeof Field> = (args) => <Field {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'ラベル',
  errorMessage: '',
  warningMessage: '',
  inputProps: {
    id: 'id',
    placeholder: '入力してください',
  },
};
