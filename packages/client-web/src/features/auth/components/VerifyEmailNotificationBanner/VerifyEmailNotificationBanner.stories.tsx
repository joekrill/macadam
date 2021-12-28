import { Meta, Story } from "@storybook/react";
import {
  VerifyEmailNotificationBanner,
  VerifyEmailNotificationBannerProps,
} from "./VerifyEmailNotificationBanner";

export default {
  title: "auth/VerifyEmailNotificationBanner",
  component: VerifyEmailNotificationBanner,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    emailAddress: {
      defaultValue: "test@example.com",
      control: { type: "text" },
    },
  },
} as Meta;

const Template: Story<VerifyEmailNotificationBannerProps> = (args) => (
  <VerifyEmailNotificationBanner {...args} />
);

export const Default = Template.bind({});

Default.storyName = "VerifyEmailNotificationBanner";
