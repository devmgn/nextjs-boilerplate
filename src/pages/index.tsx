import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Head } from '@/components/layouts/';
import Dialog from '@/components/ui/Dialog';
import useModal from '@/hooks/useModal';
import { addUser, selectUserByUid, usersSelector, selectLoginUsers } from '@/states/users';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  const users = useSelector(usersSelector);
  const loginUsers = useSelector(selectLoginUsers);
  const uidUser = useSelector(selectUserByUid(1));

  const dispatch = useDispatch();
  const { Container: Modal, ...modal } = useModal();

  const onClick = useCallback(() => {
    console.log(users, loginUsers, uidUser);
    dispatch(addUser({ id: 1, name: 'hoge', uid: Math.floor(Math.random() * 5), isLogin: true }));
    modal.setIsActive(true);
  }, [dispatch, loginUsers, modal, uidUser, users]);

  return (
    <>
      <Head />
      <button onClick={onClick}>ボタン</button>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam excepturi suscipit magni nostrum facilis officiis
        quidem repellat tempore voluptatem sint! Impedit consequuntur culpa suscipit est itaque, placeat laborum
        possimus temporibus.
      </p>
      <Modal>
        <Dialog>Dialog</Dialog>
      </Modal>
    </>
  );
};

export default Index;
