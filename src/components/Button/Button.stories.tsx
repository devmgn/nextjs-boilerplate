import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { faker } from "@faker-js/faker/locale/ja";
import { Button } from "./Button";

const meta = {
  component: Button,
  tags: ["autodocs"],
  args: {
    children: faker.lorem.sentence(),
  },
  argTypes: {
    variant: {
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      control: { type: "inline-radio" },
    },
    size: {
      options: ["default", "sm", "lg", "icon"],
      control: { type: "inline-radio" },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
