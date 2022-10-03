import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Default as Input } from '@/components/atoms/__stories__/Input.stories';
import { Default as Select } from '@/components/atoms/__stories__/Select.stories';
import { Default as Textarea } from '@/components/atoms/__stories__/Textarea.stories';
import Field from '../Field';

export default {
  title: 'molecules/Field',
  component: Field,
  decorators: [
    (Story) => (
      <form onSubmit={(e) => e.preventDefault()}>
        <Story />
      </form>
    ),
  ],
} as ComponentMeta<typeof Field>;

const Template: ComponentStory<typeof Field> = (args) => <Field {...args} />;

const defaultArgs = {
  label: faker.lorem.word(),
  successMessage: '',
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

export const SelectComponent = Template.bind({});
SelectComponent.args = {
  ...defaultArgs,
  children: <Select {...Select.args} options={Select.args?.options ?? []} />,
};
