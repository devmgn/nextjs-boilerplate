import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HttpResponse, http } from "msw";
import { expect, within } from "storybook/test";
import { ArticleList } from "./article-list";
import { getGetArticlesUrl } from "../../../../../api/openapi/articles/articles";
import {
  defineFixtures,
  respond,
} from "../../../../../api/openapi/index.fixtures";
import { createFixtureHandler } from "../../../../../mocks/fixture-handler";

// Default article list response. Fields not overridden get seeded faker data per route
const fixtures = defineFixtures({ "GET /api/articles": {} });

const meta = {
  component: ArticleList,
  args: { params: { limit: 10 } },
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 400 },
    },
  },
  // The meta beforeEach runs before the story beforeEach, so the story's
  // msw.use() wins and overrides it.
  beforeEach({ msw }) {
    msw.use(createFixtureHandler(fixtures));
  },
} satisfies Meta<typeof ArticleList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  async play({ canvas }) {
    await expect(
      await canvas.findByRole("heading", { name: /^Articles \(\d+\)$/u })
    ).toBeInTheDocument();
    // Count only within the article list to exclude the toast (sonner) <li> elements
    const list = canvas.getByRole("list", { name: "Articles" });
    await expect(within(list).getAllByRole("listitem").length).toBeGreaterThan(
      0
    );
  },
};

export const ServerError: Story = {
  beforeEach({ msw }) {
    msw.use(
      createFixtureHandler(
        fixtures.extend({
          "GET /api/articles": respond(500, {
            errors: { body: ["Internal Server Error"] },
          }),
        })
      )
    );
  },
};

// Network errors are not spec responses and can't be expressed with fixtures, so use a raw handler
export const NetworkError: Story = {
  beforeEach({ msw }) {
    msw.use(http.get(getGetArticlesUrl(), () => HttpResponse.error()));
  },
};

export const Empty: Story = {
  beforeEach({ msw }) {
    msw.use(
      createFixtureHandler(
        fixtures.extend({
          "GET /api/articles": { articles: [], articlesCount: 0 },
        })
      )
    );
  },
  async play({ canvas }) {
    await expect(
      await canvas.findByRole("heading", { name: "Articles (0)" })
    ).toBeInTheDocument();
    const list = canvas.getByRole("list", { name: "Articles" });
    await expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
  },
};
