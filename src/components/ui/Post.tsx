import { PostType } from '@/states/posts';

type PostProps = Omit<PostType, 'userId' | 'id'>;

const Post: React.FC<PostProps> = ({ title, body }) => {
  return (
    <div>
      <p>{title}</p>
      <p>{body}</p>
    </div>
  );
};

export default Post;
