import type { NextPage } from 'next';
import { useCallback } from 'react';
import { Head } from '@/components/layouts/';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, getUsers } from '@/states/ducks';

const Index: NextPage = () => {
  const users = useSelector(getUsers);
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    console.log(users);
    dispatch(addUser({ id: 1, name: 'hoge', uid: 123 }));
  }, [dispatch, users]);

  return (
    <>
      <Head />
      <button onClick={onClick}>ボタン</button>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam excepturi suscipit magni nostrum facilis officiis
        quidem repellat tempore voluptatem sint! Impedit consequuntur culpa suscipit est itaque, placeat laborum
        possimus temporibus.
      </p>
    </>
  );
};

export default Index;
