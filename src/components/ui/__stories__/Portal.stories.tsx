import { ComponentMeta, ComponentStory } from '@storybook/react';
import Portal from '../Portal';

export default { title: 'ui/Portal', component: Portal } as ComponentMeta<typeof Portal>;
const Template: ComponentStory<typeof Portal> = (props) => <Portal>{props.children}</Portal>;

export const Default = Template.bind({});

Default.args = {
  children: 'children',
};
