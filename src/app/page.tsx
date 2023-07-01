'use client';

import Container from '@/components/Container';
import Dialog from '@/components/Dialog';
import Modal from '@/components/Modal';
import Typography from '@/components/Typography';
import useDisclosure from '@/hooks/useDisclosure';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  const { isOpen, open, close } = useDisclosure();
  const hoge = useDisclosure();

  return (
    <Container style={{ height: 30000 }}>
      <button onClick={open} type="button">
        開く
      </button>
      <Typography>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
        consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
        accusamus iste debitis pariatur quae cupiditate quo quibusdam!
      </Typography>
      <Modal isOpen={hoge.isOpen} close={hoge.close}>
        <Dialog>
          <Typography onClick={hoge.open}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
        </Dialog>
      </Modal>
      <Modal isOpen={isOpen} close={close}>
        <Dialog>
          <Typography data-close-modal>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe fugiat quasi ipsam
            consequatur aliquid culpa aperiam accusantium sunt, magni ipsum quisquam laboriosam
            accusamus iste debitis pariatur quae cupiditate quo quibusdam!
          </Typography>
          <button onClick={hoge.open} type="button">
            開く
          </button>
        </Dialog>
      </Modal>
    </Container>
  );
};

export default Index;
