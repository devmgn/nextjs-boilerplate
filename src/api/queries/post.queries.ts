import type { ListPostsRequest, PostsPostIdGetRequest } from "../openapi";
import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export function getPostsQueryOptions(request: ListPostsRequest = {}) {
  return queryOptions({
    queryKey: ["getPosts", request] as const,
    queryFn: () => apiClient.listPosts(request),
  });
}
