import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Post } from '@/states/posts';

export const postsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  endpoints: (builder) => ({
    fetchPosts: builder.query<Post[], void>({
      query: () => 'posts',
    }),
  }),
});

export const { useFetchPostsQuery } = postsApi;
