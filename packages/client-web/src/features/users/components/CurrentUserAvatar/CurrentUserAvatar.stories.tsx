import { skipToken } from "@reduxjs/toolkit/query";
import { Meta, Story } from "@storybook/react";
import { UseSessionContext } from "../../../auth/hooks/useSession";
import { theme } from "../../../theme/default";
import { CurrentUserAvatar, CurrentUserAvatarProps } from "./CurrentUserAvatar";

export default {
  title: "Users/CurrentUserAvatar",
  component: CurrentUserAvatar,
  argTypes: {
    email: {
      control: { type: "text" },
    },
    name: {
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
  name?: string;
  email?: string;
}

const Template: Story<StoryProps> = ({ name, email = "", ...props }) => (
  <UseSessionContext.Provider
    value={{
      selectIdentity: () => ({
        id: "",
        schema_id: "",
        schema_url: "",
        state: null,
        traits: {
          email,
          name,
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
