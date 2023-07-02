import { faker } from '@faker-js/faker/locale/ja';
import useDisclosure from '@/hooks/useDisclosure';
import useModalContext from '@/hooks/useModalContext';
import Dialog from '../Dialog';
import Modal from '../Modal';
import Typography from '../Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Modal> = {
  title: 'components/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

const paragraph = faker.lorem.paragraph(10);
const image = faker.image.urlLoremFlickr();

const DummyDialog = () => {
  const { close } = useModalContext();

  return (
    <Dialog>
      <button type="button" onClick={close}>
        ❌
      </button>
      <Typography>{paragraph}</Typography>
      <button type="button" data-close-modal>
        ❌
      </button>
    </Dialog>
  );
};

const DummyChildDialog = () => {
  const { open, ...rest } = useDisclosure();
  const { close } = useModalContext();

  return (
    <>
      <Dialog>
        <Typography>
          <button type="button" onClick={open}>
            子モーダルを開く
          </button>
        </Typography>
        <img src={image} alt="" />
        <Typography>{paragraph}</Typography>
        <button type="button" onClick={close}>
          ❌
        </button>
      </Dialog>
      <Modal {...rest}>
        <DummyDialog />
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => {
    const { open, ...rest } = useDisclosure();
    return (
      <div style={{ height: '200vh' }}>
        <button type="button" onClick={open}>
          モーダルを開く
        </button>
        <Modal {...args} {...rest}>
          <DummyDialog />
        </Modal>
      </div>
    );
  },
};

export const WithChildModal: Story = {
  render: (args) => {
    const { open, ...rest } = useDisclosure();
    return (
      <div style={{ height: '200vh' }}>
        <button type="button" onClick={open}>
          モーダルを開く
        </button>
        <Modal {...args} {...rest}>
          <DummyChildDialog />
        </Modal>
      </div>
    );
  },
};
