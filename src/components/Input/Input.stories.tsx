import { faker } from "@faker-js/faker/locale/ja";
import { Input } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  component: Input,
  args: {
    defaultValue: faker.lorem.sentence(),
    placeholder: faker.lorem.sentence(),
    isError: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
