import { Meta, Story } from "@storybook/react";
import { Home, HomeProps } from "./Home";

export default {
  title: "Pages/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as Meta;

const Template: Story<HomeProps> = (args) => <Home {...args} />;

export const Default = Template.bind({});

Default.storyName = "Home";
