import { skipToken } from "@reduxjs/toolkit/query";
import { Meta, Story } from "@storybook/react";
import { UseSessionContext } from "../../../auth/hooks/useSession";
import { CurrentUserMenu, CurrentUserMenuProps } from "./CurrentUserMenu";

export default {
  title: "users/CurrentUserMenu",
  component: CurrentUserMenu,
  argTypes: {
    email: {
      control: { type: "text" },
      defaultValue: "jdoe@example.com",
    },
    firstName: {
      control: { type: "text" },
      defaultValue: "John",
    },
    lastName: {
      control: { type: "text" },
      defaultValue: "Doe",
    },
  },
} as Meta;

interface StoryProps extends CurrentUserMenuProps {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const Template: Story<StoryProps> = ({
  firstName,
  lastName,
  email = "",
  ...props
}) => (
  <UseSessionContext.Provider
    value={{
      selectIdentity: () => ({
        id: "",
        schema_id: "",
        schema_url: "",
        state: null,
        traits: {
          email,
          name: {
            first: firstName,
            last: lastName,
          },
        },
      }),
      selectIsVerified: () => true,
      selectSession: () => ({ id: "" }),
      selectSessionLastUpdated: () => undefined,
      whoamiQueryArg: skipToken,
    }}
  >
    <CurrentUserMenu {...props} />
  </UseSessionContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "CurrentUserMenu";
