import React, { useCallback } from 'react';
import { uniqueId } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Head } from '@/components/layouts/';
import Dialog from '@/components/ui/Dialog';
import Modal, { useModalState } from '@/components/ui/Modal';
import Posts from '@/components/ui/Posts';
import { addUser, selectUserByUid, usersSelector, selectLoginUsers } from '@/states/users';
import type { NextPage } from 'next';

const Index: NextPage = () => {
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
      <Head />
      <button onClick={onClick}>ボタン</button>
      <Posts />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam excepturi suscipit magni nostrum facilis officiis
        quidem repellat tempore voluptatem sint! Impedit consequuntur culpa suscipit est itaque, placeat laborum
        possimus temporibus.
      </p>

      <Modal {...modalState}>
        <Dialog>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita deleniti optio quas iste, ab
            voluptatum exercitationem dolor recusandae, atque illum delectus aspernatur dolores eveniet architecto
            officia! Omnis, autem mollitia.
          </p>
        </Dialog>
      </Modal>
    </>
  );
};

export default Index;
