import { faker } from "@faker-js/faker/locale/ja";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from ".";

const meta: Meta<typeof Label> = {
  component: Label,
  args: {
    children: faker.lorem.sentence(),
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};
