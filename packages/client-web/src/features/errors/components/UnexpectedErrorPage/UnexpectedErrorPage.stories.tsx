import { Meta, Story } from "@storybook/react";
import {
  UnexpectedErrorPage,
  UnexpectedErrorPageProps,
} from "./UnexpectedErrorPage";

export default {
  title: "Errors/UnexpectedErrorPage",
  component: UnexpectedErrorPage,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
    themingDisabled: true,
  },
} as Meta;

const Template: Story<UnexpectedErrorPageProps> = (args) => (
  <UnexpectedErrorPage {...args} />
);

export const Default = Template.bind({});

Default.args = {
  eventId: "774760b9-219c-408d-9340-9e1a0db50d0d",
  // resetError: () => {},
};

Default.storyName = "UnexpectedErrorPage";
