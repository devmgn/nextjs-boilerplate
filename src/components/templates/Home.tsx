import { useDispatch, useSelector } from 'react-redux';
import useModal from '@/hooks/useModal';
import { selectUserName } from '@/states/user/selectors';
import { setUserName } from '@/states/user/slice';
import Modal from './Modal';
import Paragraph from '../atoms/Paragraph';

const Home = () => {
  const userName = useSelector(selectUserName);
  const dispatch = useDispatch();
  const { activate, ...modal } = useModal();

  return (
    <>
      <Paragraph onClick={() => dispatch(setUserName('aaa'))}>ユーザー名：{userName}</Paragraph>
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
