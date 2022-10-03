import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Radio from '../Radio';

export default {
  title: 'atoms/Radio',
  component: Radio,
  decorators: [
    (Story) => (
      <form onSubmit={(e) => e.preventDefault()}>
        <Story />
      </form>
    ),
  ],
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args) => <Radio {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: faker.name.fullName(),
  id: faker.datatype.string(),
};
