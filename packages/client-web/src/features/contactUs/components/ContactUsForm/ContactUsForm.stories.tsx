import { Meta, Story } from "@storybook/react";
import { ContactUsForm, ContactUsFormProps } from "./ContactUsForm";

export default {
  title: "ContactUs/ContactUsForm",
  component: ContactUsForm,
  argTypes: {
    isLoading: {
      defaultValue: false,
      control: { type: "boolean" },
    },
  },
} as Meta;

const Template: Story<ContactUsFormProps> = (args) => (
  <ContactUsForm {...args} />
);

export const Default = Template.bind({});

Default.storyName = "ContactUsForm";
