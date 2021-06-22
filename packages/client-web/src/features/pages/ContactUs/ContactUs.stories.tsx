import { Meta, Story } from "@storybook/react";
import { ContactUs, ContactUsProps } from "./ContactUs";

export default {
  title: "Pages/ContactUs",
  component: ContactUs,
  parameters: {
    layout: "fullscreen",
  },
} as Meta;

const Template: Story<ContactUsProps> = (args) => <ContactUs {...args} />;

export const Default = Template.bind({});

Default.storyName = "ContactUs";
