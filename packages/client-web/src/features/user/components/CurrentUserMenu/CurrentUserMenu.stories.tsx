import { UseSessionContext } from "@macadam/api-client";
import { skipToken } from "@reduxjs/toolkit/query";
import { Meta, Story } from "@storybook/react";
import { useMemo } from "react";
import { CurrentUserMenu, CurrentUserMenuProps } from "./CurrentUserMenu";

export default {
  title: "Users/CurrentUserMenu",
  component: CurrentUserMenu,
  argTypes: {
    email: {
      control: { type: "text" },
      defaultValue: "jdoe@example.com",
    },
    name: {
      control: { type: "text" },
      defaultValue: "John",
    },
  },
} as Meta;

interface StoryProps extends CurrentUserMenuProps {
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
    [email, name],
  );
  const memoizedSession = useMemo(() => ({ id: "" }), []);
  const memoizedLastUpdated = useMemo(() => Date.now(), []);

  return (
    <UseSessionContext.Provider
      value={{
        selectAuthState: () => "authenticated",
        selectIdentity: () => memoizedIdentity,
        selectIsVerified: () => true,
        selectSession: () => memoizedSession,
        selectSessionLastUpdated: () => memoizedLastUpdated,
        whoamiQueryArg: skipToken,
      }}
    >
      <CurrentUserMenu {...props} />
    </UseSessionContext.Provider>
  );
};

export const Default = Template.bind({});

Default.storyName = "CurrentUserMenu";
