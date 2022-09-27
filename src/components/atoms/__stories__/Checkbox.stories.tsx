import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Checkbox from '../Checkbox';

export default {
  title: 'atoms/Checkbox',
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;
const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: faker.name.jobArea(),
  id: 'hoge',
};
