import { createQueryKeys } from "@lukemorales/query-key-factory";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const post = createQueryKeys("post", {
  list: () => ({
    queryKey: ["all"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      const data: Post[] = await response.json();
      return data;
    },
  }),
  item: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      // NOTE: 500ms delay to simulate network latency
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      const data: Post = await response.json();
      return data;
    },
  }),
});
