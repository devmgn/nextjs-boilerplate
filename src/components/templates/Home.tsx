import { useCallback, useState } from 'react';
import { Box, Button, Fade, Modal as MuiModal, Typography, styled } from '@mui/material';
import type { NextPage } from 'next';

const style = {
  maxWidth: 200,
  width: '100%',
  maxHeight: 'calc(100dvh - 48px)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Modal = styled(MuiModal)`
  display: grid;
  place-items: center;
  padding: 24px;
  .MuiModal-backdrop {
    touch-action: none;
  }
`;

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div style={{ height: '2000vh' }}>
      <Typography>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat quidem
        ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore ullam dignissimos
        optio perspiciatis numquam neque sint cumque?
      </Typography>
      <Button onClick={openModal}>ぼたん</Button>
      <Modal open={isOpen} onClose={closeModal}>
        <Fade in={isOpen}>
          <Box sx={{ ...style, overflow: 'auto' }}>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime doloribus placeat
              quidem ratione reprehenderit ducimus at nemo ipsam error voluptatum unde, tempore
              ullam dignissimos optio perspiciatis numquam neque sint cumque?
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Home;
