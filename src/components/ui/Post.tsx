import { Post } from '@/states/posts';

type PostProps = Omit<Post, 'id' | 'userId'>;

const Post: React.FC<PostProps> = ({ title, body }) => {
  return (
    <div>
      <p>{title}</p>
      <p>{body}</p>
    </div>
  );
};

export default Post;
