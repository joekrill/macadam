import { Meta, Story } from "@storybook/react";
import { NotFoundPage, NotFoundPageProps } from "./NotFoundPage";

export default {
  title: "Errors/NotFoundPage",
  component: NotFoundPage,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as Meta;

const Template: Story<NotFoundPageProps> = (args) => <NotFoundPage {...args} />;

export const Default = Template.bind({});

Default.storyName = "NotFoundPage";
