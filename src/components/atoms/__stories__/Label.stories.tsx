import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Label from '../Label';

export default {
  title: 'atoms/Label',
  component: Label,
} as ComponentMeta<typeof Label>;
const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: faker.name.jobArea(),
};
