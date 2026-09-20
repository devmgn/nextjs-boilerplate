import type { ListPostsRequest } from "../../openapi";
import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../../api-client";

export function getPostsQueryOptions(request: ListPostsRequest = {}) {
  return queryOptions({
    queryKey: ["getPosts", request] as const,
    queryFn: async () => await apiClient.listPosts(request),
  });
}
