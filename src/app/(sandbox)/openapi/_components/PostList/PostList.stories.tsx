import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { PostList } from "./PostList";
import { handlers } from "../../../../../mocks/handlers";

const meta = {
  component: PostList,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 400 },
    },
  },
  // meta の beforeEach は story の beforeEach より先に走るため、story 側の
  // msw.use() が後勝ちで上書きする。
  beforeEach({ msw }) {
    msw.use(...handlers);
  },
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof PostList>;

export const Default: Story = {};

export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get("https://jsonplaceholder.typicode.com/posts", () =>
        HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );
  },
};

export const NetworkError: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get("https://jsonplaceholder.typicode.com/posts", () =>
        HttpResponse.error(),
      ),
    );
  },
};

export const Empty: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get("https://jsonplaceholder.typicode.com/posts", () =>
        HttpResponse.json([], { status: 200 }),
      ),
    );
  },
};
