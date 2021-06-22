import { Meta, Story } from "@storybook/react";
import { TermsOfService, TermsOfServiceProps } from "./TermsOfService";

export default {
  title: "Pages/TermsOfService",
  component: TermsOfService,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as Meta;

const Template: Story<TermsOfServiceProps> = (args) => (
  <TermsOfService {...args} />
);

export const Default = Template.bind({});

Default.storyName = "TermsOfService";
