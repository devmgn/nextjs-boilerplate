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

// 記事一覧の既定応答。上書きしない項目は route ごとに seed 固定の faker データになる
const fixtures = defineFixtures({ "GET /api/articles": {} });

const meta = {
  component: ArticleList,
  args: { params: { limit: 10 } },
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 400 },
    },
  },
  // meta の beforeEach は story の beforeEach より先に走るため、story 側の
  // msw.use() が後勝ちで上書きする。
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
    // 通知（sonner）の <li> と区別するため、記事一覧のリストの中だけを数える
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

// 通信エラーは spec の応答ではないため fixtures では表せず、素の handler で作る
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
