import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Textarea from '../Textarea';

export default {
  title: 'atoms/Textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <form onSubmit={(e) => e.preventDefault()}>
        <Story />
      </form>
    ),
  ],
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = (args) => <Textarea {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: faker.lorem.word(),
  disabled: false,
  readOnly: false,
  isSuccess: false,
  isError: false,
  isWarning: false,
  rows: faker.random.numeric(),
  id: faker.datatype.string(),
};
