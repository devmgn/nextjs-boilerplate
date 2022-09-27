import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Text from '../Text';

export default {
  title: 'atoms/Text',
  component: Text,
} as ComponentMeta<typeof Text>;
const Template: ComponentStory<typeof Text> = (args) => <Text {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: faker.lorem.paragraph(),
};
