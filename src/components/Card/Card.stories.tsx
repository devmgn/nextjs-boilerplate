import { faker } from "@faker-js/faker/locale/ja";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from ".";

const meta: Meta<typeof Card> = {
  component: Card,
  args: {
    children: faker.lorem.sentence(),
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
