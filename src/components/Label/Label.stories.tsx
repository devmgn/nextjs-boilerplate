import { faker } from "@faker-js/faker/locale/ja";
import { Label } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  component: Label,
  args: {
    children: faker.lorem.sentence(),
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};
