import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Default as Input } from '@/components/atoms/__stories__/Input.stories';
import { Default as Select } from '@/components/atoms/__stories__/Select.stories';
import { Default as Textarea } from '@/components/atoms/__stories__/Textarea.stories';
import Field from '@/components/molecules/Field';
import FieldSet from '../FieldSet';

export default {
  title: 'organisms/FieldSet',
  component: FieldSet,
} as ComponentMeta<typeof FieldSet>;

const Template: ComponentStory<typeof FieldSet> = (args) => <FieldSet {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: faker.lorem.word(),
  children: (
    <>
      <Field label={faker.lorem.word()}>
        <Input {...Input.args} />
      </Field>
      <Field label={faker.lorem.word()}>
        <Select {...Select.args} options={Select.args?.options ?? []} />
      </Field>
      <Field label={faker.lorem.word()}>
        <Textarea {...Textarea.args} />
      </Field>
    </>
  ),
};
