import { faker } from "@faker-js/faker/locale/ja";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./Card";

const meta = {
  component: Card,
  args: {
    children: faker.lorem.sentence(),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
