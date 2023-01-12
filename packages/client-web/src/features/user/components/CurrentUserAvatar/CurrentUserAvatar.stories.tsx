import { UseSessionContext } from "@macadam/api-client";
import { Meta, Story } from "@storybook/react";
import { useMemo } from "react";
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

const Template: Story<StoryProps> = ({ name, email = "", ...props }) => {
  const memoizedIdentity = useMemo(
    () => ({
      id: "",
      schema_id: "",
      schema_url: "",
      state: null,
      traits: {
        email,
        name,
      },
    }),
    [email, name]
  );
  const memoizedSession = useMemo(() => ({ id: "" }), []);
  return (
    <UseSessionContext.Provider
      value={{
        selectAuthState: () => "authenticated",
        selectIdentity: () => memoizedIdentity,
        selectIsVerified: () => true,
        selectSession: () => memoizedSession,
        selectSessionLastUpdated: () => undefined,
        whoamiQueryArg: undefined,
      }}
    >
      <CurrentUserAvatar {...props} />
    </UseSessionContext.Provider>
  );
};

export const Default = Template.bind({});

Default.storyName = "CurrentUserAvatar";
