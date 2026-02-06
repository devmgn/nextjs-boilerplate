import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { faker } from "@faker-js/faker/locale/ja";
import { Card } from ".";

const meta = {
  component: Card,
  args: {
    children: faker.lorem.sentence(),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
