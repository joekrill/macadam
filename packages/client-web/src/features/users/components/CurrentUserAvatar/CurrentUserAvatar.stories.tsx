import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Meta, Story } from "@storybook/react";
import { UseSessionContext } from "../../../auth/hooks/useSession";
import { theme } from "../../../theme/default";
import { CurrentUserAvatar, CurrentUserAvatarProps } from "./CurrentUserAvatar";

export default {
  title: "users/CurrentUserAvatar",
  component: CurrentUserAvatar,
  argTypes: {
    email: {
      control: { type: "text" },
    },
    firstName: {
      control: { type: "text" },
    },
    lastName: {
      control: { type: "text" },
    },
    size: {
      control: { type: "inline-radio" },
      defaultValue: "md",
      options: Object.keys(theme.components.Avatar.sizes),
    },
  },
} as Meta;

interface StoryProps extends CurrentUserAvatarProps {
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
    <CurrentUserAvatar {...props} />
  </UseSessionContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "CurrentUserAvatar";
