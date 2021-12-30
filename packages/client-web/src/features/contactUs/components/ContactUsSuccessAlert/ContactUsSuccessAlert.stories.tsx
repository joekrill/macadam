import { Meta, Story } from "@storybook/react";
import { ContactUsSuccessAlert } from "./ContactUsSuccessAlert";

export default {
  title: "ContactUs/ContactUsSuccessAlert",
  component: ContactUsSuccessAlert,
} as Meta;

const Template: Story = (args) => <ContactUsSuccessAlert />;

export const Default = Template.bind({});

Default.storyName = "ContactUsSuccessAlert";
