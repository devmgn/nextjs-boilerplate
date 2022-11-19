import { faker } from '@faker-js/faker/locale/ja';
import { Meta, StoryFn } from '@storybook/react';
import useModal from '@/hooks/useModal';
import Modal from '../Modal';

export default {
  title: 'molecules/Modal',
  component: Modal,
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  const modal = useModal();

  return (
    <>
      <button onClick={() => modal.activate()}>モーダルを開く</button>
      <Modal {...args} {...modal} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: faker.lorem.paragraph(),
};
