import { Meta, Story } from "@storybook/react";
import { Faq, FaqProps } from "./Faq";

export default {
  title: "Pages/FAQ",
  component: Faq,
  parameters: {
    layout: "fullscreen",
  },
} as Meta;

const Template: Story<FaqProps> = (args) => <Faq {...args} />;

export const Default = Template.bind({});

Default.storyName = "FAQ";
