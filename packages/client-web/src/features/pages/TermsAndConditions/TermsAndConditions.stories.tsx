import { Meta, Story } from "@storybook/react";
import {
  TermsAndConditions,
  TermsAndConditionsProps,
} from "./TermsAndConditions";

export default {
  title: "Pages/TermsAndConditions",
  component: TermsAndConditions,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as Meta;

const Template: Story<TermsAndConditionsProps> = (args) => (
  <TermsAndConditions {...args} />
);

export const Default = Template.bind({});

Default.storyName = "TermsAndConditions";
