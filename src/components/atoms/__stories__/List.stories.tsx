import React from 'react';
import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import List from '../List';

export default {
  title: 'atoms/List',
  component: List,
  argTypes: {
    as: {
      options: ['ul', 'ol'],
      control: {
        type: 'radio',
      },
    },
  },
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = (args) => <List {...args} />;

export const Default = Template.bind({});
Default.args = {
  as: 'ul',
  items: [...faker.datatype.array(Number(faker.random.numeric())).map((_v) => faker.lorem.paragraph())],
};
