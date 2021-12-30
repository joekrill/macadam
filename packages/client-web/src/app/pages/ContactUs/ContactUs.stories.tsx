import { skipToken } from "@reduxjs/toolkit/query";
import { Meta, Story } from "@storybook/react";
import { UseSessionContext } from "../../../features/auth/hooks/useSession";
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
      selectIdentity: () => ({
        id: "",
        schema_id: "",
        schema_url: "",
        state: null,
        traits: {
          // email,
          // name,
        },
      }),
      selectIsVerified: () => true,
      selectSession: () => ({ id: "" }),
      selectSessionLastUpdated: () => undefined,
      whoamiQueryArg: skipToken,
    }}
  >
    <ContactUs {...args} />
  </UseSessionContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "ContactUs";
