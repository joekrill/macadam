import { Meta, Story } from "@storybook/react";
import { PrivacyPolicy, PrivacyPolicyProps } from "./PrivacyPolicy";

export default {
  title: "Pages/PrivacyPolicy",
  component: PrivacyPolicy,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as Meta;

const Template: Story<PrivacyPolicyProps> = (args) => (
  <PrivacyPolicy {...args} />
);

export const Default = Template.bind({});

Default.storyName = "PrivacyPolicy";
