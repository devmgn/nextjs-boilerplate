import { useCallback } from 'react';
import { uniqueId } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, selectLoginUsers, selectUserByUid, usersSelector } from '@/states/users';
import Paragraph from '../atoms/Paragraph';
import Modal, { useModalState } from '../layouts/Modal';
import Accordion from '../molecules/Accordion';
import Dialog from '../molecules/Dialog';
import Posts from '../molecules/Posts';

const Home = () => {
  const users = useSelector(usersSelector);
  const loginUsers = useSelector(selectLoginUsers);
  const uidUser = useSelector(selectUserByUid('5'));
  const { activate, ...modalState } = useModalState();

  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    console.log(users, loginUsers, uidUser);
    dispatch(addUser({ id: 1, name: 'hoge', uid: uniqueId(), isLogin: true }));
    activate();
  }, [activate, dispatch, loginUsers, uidUser, users]);

  return (
    <>
      <button onClick={onClick}>ボタン</button>
      <Posts />

      <Paragraph>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam excepturi suscipit magni nostrum facilis officiis
        quidem repellat tempore voluptatem sint! Impedit consequuntur culpa suscipit est itaque, placeat laborum
        possimus temporibus.
      </Paragraph>
      <Accordion>hoge</Accordion>

      <Modal {...modalState}>
        <Dialog>
          <Paragraph>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita deleniti optio quas iste, ab
            voluptatum exercitationem dolor recusandae, atque illum delectus aspernatur dolores eveniet architecto
            officia! Omnis, autem mollitia.
          </Paragraph>
        </Dialog>
      </Modal>
    </>
  );
};

export default Home;
