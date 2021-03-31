import React from "react";
import { Story, Meta } from "@storybook/react";

import { App } from "./App";

export default {
  title: "App",
  component: App,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta;

const Template: Story<{}> = (args) => <App {...args} />;

export const Default = Template.bind({});
Default.storyName = "App";
