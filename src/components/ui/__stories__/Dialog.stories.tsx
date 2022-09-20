import { ComponentMeta, ComponentStory } from '@storybook/react';
import Dialog from '../Dialog';

export default {
  title: 'ui/Dialog',
  component: Dialog,
} as ComponentMeta<typeof Dialog>;
const Template: ComponentStory<typeof Dialog> = (props) => <Dialog>{props.children}</Dialog>;

export const Default = Template.bind({});
Default.args = {
  children: 'children',
};
