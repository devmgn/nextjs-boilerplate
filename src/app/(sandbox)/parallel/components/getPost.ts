import { createQueryKeys } from "@lukemorales/query-key-factory";
import ky from "ky";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const post = createQueryKeys("post", {
  list: () => ({
    queryKey: ["all"],
    queryFn: () => {
      return ky
        .get("https://jsonplaceholder.typicode.com/posts")
        .json<Post[]>();
    },
  }),
  item: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      // NOTE: 500ms delay to simulate network latency
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });

      return ky
        .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .json<Post>();
    },
  }),
});
