import { UseSessionContext } from "@macadam/api-client";
import { Meta, Story } from "@storybook/react";
import { ContactUs, ContactUsProps } from "./ContactUs";

export default {
  title: "Pages/ContactUs",
  component: ContactUs,
  parameters: {
    layout: "fullscreen",
  },
} as Meta;

const Template: Story<ContactUsProps> = (args) => (
  <UseSessionContext.Provider
    value={{
      selectAuthState: () => "unauthenticated",
      selectIdentity: () => undefined,
      selectIsVerified: () => false,
      selectSession: () => undefined,
      selectSessionLastUpdated: () => undefined,
      whoamiQueryArg: undefined,
    }}
  >
    <ContactUs {...args} />
  </UseSessionContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "ContactUs";
