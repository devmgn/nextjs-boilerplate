import { faker } from '@faker-js/faker/locale/ja';
import { Meta, StoryFn } from '@storybook/react';
import Paragraph from '../Paragraph';

export default {
  title: 'atoms/Paragraph',
  component: Paragraph,
} as Meta<typeof Paragraph>;

const Template: StoryFn<typeof Paragraph> = (args) => <Paragraph {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: faker.lorem.paragraph(),
};
