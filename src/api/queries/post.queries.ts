import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { ListPostsRequest, PostsPostIdGetRequest } from "../openapi";
import { apiClient } from "../apiClient";

export const postQueries = createQueryKeys("postQueries", {
  getPosts: (request: ListPostsRequest = {}) => ({
    queryKey: ["getPosts", request],
    queryFn: () => apiClient.listPosts(request),
  }),
  getPostById: (request: PostsPostIdGetRequest) => ({
    queryKey: ["getPost", request],
    queryFn: () => apiClient.postsPostIdGet(request),
  }),
});
