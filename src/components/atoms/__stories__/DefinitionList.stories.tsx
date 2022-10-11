import React from 'react';
import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import DefinitionList from '../DefinitionList';

export default {
  title: 'atoms/DefinitionList',
  component: DefinitionList,
} as ComponentMeta<typeof DefinitionList>;

const Template: ComponentStory<typeof DefinitionList> = (args) => <DefinitionList {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    ...faker.datatype
      .array(Number(faker.random.numeric()))
      .reduce<React.ComponentProps<typeof DefinitionList>['items']>(
        (prev) => [...prev, { term: faker.lorem.slug(), description: faker.lorem.paragraph() }],
        []
      ),
  ],
};
