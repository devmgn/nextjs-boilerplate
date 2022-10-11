import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import FieldLabel from '../FieldLabel';

export default {
  title: 'atoms/FieldLabel',
  component: FieldLabel,
} as ComponentMeta<typeof FieldLabel>;

const Template: ComponentStory<typeof FieldLabel> = (args) => <FieldLabel {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: faker.lorem.word(),
};
