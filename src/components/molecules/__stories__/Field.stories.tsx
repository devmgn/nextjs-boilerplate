import { faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Input from '@/components/atoms/Input';
import SelectBox from '@/components/atoms/SelectBox';
import Textarea from '@/components/atoms/Textarea';
import Field from '../Field';

export default {
  title: 'molecules/Field',
  component: Field,
} as ComponentMeta<typeof Field>;

const Template: ComponentStory<typeof Field> = (args) => <Field {...args} />;

export const InputComponent = Template.bind({});
InputComponent.args = {
  label: 'ラベル',
  errorMessage: '',
  warningMessage: '',
  children: <Input id={faker.datatype.uuid()} />,
};

export const TextareaComponent = Template.bind({});
TextareaComponent.args = {
  label: 'ラベル',
  errorMessage: '',
  warningMessage: '',
  children: <Textarea id={faker.datatype.uuid()} rows={2} />,
};

export const SelectBoxComponent = Template.bind({});
SelectBoxComponent.args = {
  label: 'ラベル',
  errorMessage: '',
  warningMessage: '',
  children: <SelectBox id={faker.datatype.uuid()} options={[]} />,
};
