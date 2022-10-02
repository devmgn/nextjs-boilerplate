import React from 'react';
import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SelectBox from '../SelectBox';

export default {
  title: 'atoms/SelectBox',
  component: SelectBox,
} as ComponentMeta<typeof SelectBox>;

const Template: ComponentStory<typeof SelectBox> = (args) => <SelectBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  isError: false,
  isWarning: false,
  defaultValue: '',
  id: faker.datatype.string(),
  options: [
    {
      label: '初期値',
    },
    ...faker.datatype
      .array(Number(faker.random.numeric()))
      .reduce<React.ComponentProps<typeof SelectBox>['options']>(
        (prev, option) => [...prev, { label: faker.lorem.slug(), value: option }],
        []
      ),
  ],
};
