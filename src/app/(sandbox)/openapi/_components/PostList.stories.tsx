import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { PostList } from "./PostList";
import { handlers } from "../../../../mocks/handlers";

const meta = {
  component: PostList,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 400 },
    },
    msw: { handlers },
  },
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof PostList>;

export const Default: Story = {};

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts", () =>
          HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          ),
        ),
      ],
    },
  },
};

export const NetworkError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts", () =>
          HttpResponse.error(),
        ),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts", () =>
          HttpResponse.json([], { status: 200 }),
        ),
      ],
    },
  },
};
