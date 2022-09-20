import { ComponentMeta, ComponentStory } from '@storybook/react';
import Modal from '../Modal';

export default {
  title: 'ui/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (props) => <Modal {...props}>{props.children}</Modal>;

export const Default = Template.bind({});

Default.args = {
  children: 'children',
};
