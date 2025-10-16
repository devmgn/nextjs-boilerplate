import { faker } from "@faker-js/faker/locale/ja";
import Image from "next/image";
import { Backdrop } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const paragraphs = faker.lorem.paragraphs();
const image = faker.image.avatarGitHub();

const meta = {
  component: Backdrop,
  args: {
    open: true,
    blur: true,
  },
  decorators: [
    (story) => (
      <div className="relative h-[200px] w-full">
        <p>{paragraphs}</p>
        <div>
          <Image alt="" height="320" src={image} width="320" />
        </div>
        {story()}
      </div>
    ),
  ],
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof Backdrop>;

export const Default: Story = {};
