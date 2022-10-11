import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostType } from '@/states/posts';

export const postsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    fetchPosts: builder.query<PostType[], string>({
      query: () => 'posts',
    }),
  }),
});

export const { useFetchPostsQuery } = postsApi;
