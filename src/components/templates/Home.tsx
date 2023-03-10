import { useDispatch, useSelector } from 'react-redux';
import useModal from '@/hooks/useModal';
import { getLoginStatus, getUserName } from '@/states/user/selectors';
import { login, setUserName } from '@/states/user/slice';
import Modal from './Modal';
import Paragraph from '../atoms/Paragraph';

const Home = () => {
  const { activate, ...modal } = useModal();
  const dispatch = useDispatch();
  const loginStatus = useSelector(getLoginStatus);
  const userName = useSelector(getUserName);

  return (
    <>
      <button
        value="名前"
        onClick={(event) => {
          dispatch(setUserName(event.currentTarget.value));
          dispatch(login());
        }}
        type="button"
      >
        ログイン
      </button>
      <Paragraph>ログイン状態：{loginStatus.toString()}</Paragraph>
      <Paragraph>ユーザー名：{userName}</Paragraph>
      <button onClick={() => activate()} type="button">
        モーダルを開く
      </button>
      <Modal {...modal}>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non expedita deleniti optio quas
          iste, ab voluptatum exercitationem dolor recusandae, atque illum delectus aspernatur
          dolores eveniet architecto officia! Omnis, autem mollitia.
        </Paragraph>
      </Modal>
    </>
  );
};

export default Home;
