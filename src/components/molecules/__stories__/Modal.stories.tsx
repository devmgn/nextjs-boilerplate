import { faker } from '@faker-js/faker/locale/ja';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Modal, { useModalState } from '../Modal';

export default {
  title: 'molecules/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  const modalState = useModalState();

  return (
    <>
      <button onClick={() => modalState.activate()}>モーダルを開く</button>
      <Modal {...args} {...modalState} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: faker.lorem.paragraph(),
};
