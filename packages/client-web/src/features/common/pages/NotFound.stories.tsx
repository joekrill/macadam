import { Meta, Story } from "@storybook/react";
import { NotFound, NotFoundProps } from "./NotFound";

export default {
  title: "Pages/NotFound",
  component: NotFound,
  parameters: {
    layout: "fullscreen",
  },
} as Meta;

const Template: Story<NotFoundProps> = (args) => <NotFound {...args} />;

export const Default = Template.bind({});

Default.storyName = "NotFound";
