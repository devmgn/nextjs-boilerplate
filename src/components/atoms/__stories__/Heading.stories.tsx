import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Heading from '../Heading';

export default {
  title: 'atoms/Heading',
  component: Heading,
  argTypes: {
    as: {
      options: [...new Array(6).fill('').map((_v, index) => `h${index + 1}`), 'legend'],
      control: {
        type: 'radio',
      },
    },
    $type: {
      options: ['pageTitle', 'sectionTitle'],
      control: {
        type: 'radio',
      },
    },
  },
} as ComponentMeta<typeof Heading>;

const Template: ComponentStory<typeof Heading> = (args) => <Heading {...args} />;

export const Default = Template.bind({});
Default.args = {
  as: 'h1',
  $type: 'pageTitle',
  children: faker.lorem.paragraph(),
};
