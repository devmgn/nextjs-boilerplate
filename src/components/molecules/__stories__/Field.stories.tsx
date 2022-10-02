import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Default as Input } from '@/components/atoms/__stories__/Input.stories';
import { Default as SelectBox } from '@/components/atoms/__stories__/SelectBox.stories';
import { Default as Textarea } from '@/components/atoms/__stories__/Textarea.stories';
import Field from '../Field';

export default {
  title: 'molecules/Field',
  component: Field,
} as ComponentMeta<typeof Field>;

const Template: ComponentStory<typeof Field> = (args) => <Field {...args} />;

const defaultArgs = {
  label: faker.lorem.word(),
  errorMessage: '',
  warningMessage: '',
};

export const InputComponent = Template.bind({});
InputComponent.args = {
  ...defaultArgs,
  children: <Input {...Input.args} />,
};

export const TextareaComponent = Template.bind({});
TextareaComponent.args = {
  ...defaultArgs,
  children: <Textarea {...Textarea.args} />,
};

export const SelectBoxComponent = Template.bind({});
SelectBoxComponent.args = {
  ...defaultArgs,
  children: <SelectBox {...SelectBox.args} options={SelectBox.args?.options ?? []} />,
};
