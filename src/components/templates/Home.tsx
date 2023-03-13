import { useDispatch, useSelector } from 'react-redux';
import useModal from '@/hooks/useModal';
import { selectUserId, selectUserName } from '@/states/user/selectors';
import { setUserName, setUserId, clearUser } from '@/states/user/slice';
import Modal from './Modal';
import Paragraph from '../atoms/Paragraph';

const Home = () => {
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const { activate, ...modal } = useModal();

  return (
    <>
      <Paragraph onClick={() => dispatch(setUserName('aaa'))}>ユーザー名：{userName}</Paragraph>
      <Paragraph onClick={() => dispatch(setUserId(200))}>ユーザーID：{userId}</Paragraph>
      <button onClick={() => dispatch(clearUser())} type="button">
        初期化
      </button>
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
