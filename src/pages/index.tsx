import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Head } from '@/components/layouts/';
import Dialog from '@/components/ui/Dialog';
import useModal from '@/hooks/useModal';
import { addUser, getUsers } from '@/states/ducks';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  const users = useSelector(getUsers);
  const dispatch = useDispatch();
  const { Container: Modal, ...modal } = useModal();

  const onClick = useCallback(() => {
    console.log(users);
    dispatch(addUser({ id: 1, name: 'hoge', uid: 123 }));
    modal.setIsActive(true);
  }, [dispatch, modal, users]);

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
