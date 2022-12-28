import { faker } from '@faker-js/faker/locale/ja';
import useModal from '@/hooks/useModal';
import Modal from '../Modal';
import type { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'molecules/Modal',
  component: Modal,
} as Meta<typeof Modal>;

export const Default: StoryObj<typeof Modal> = {
  args: {
    children: faker.lorem.paragraph(),
  },
  render: (args) => {
    const modal = useModal();
    return (
      <>
        <button onClick={modal.activate} type="button">
          モーダルを開く
        </button>
        <Modal {...args} {...modal} />
      </>
    );
  },
};
