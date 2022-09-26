import { useFetchPostsQuery } from '@/states/posts';
import Post from './Post';

const Posts: React.FC = () => {
  const { data } = useFetchPostsQuery();

  return (
    <>
      {data?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </>
  );
};

export default Posts;
