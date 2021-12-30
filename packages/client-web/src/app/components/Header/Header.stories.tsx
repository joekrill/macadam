import { skipToken } from "@reduxjs/toolkit/query";
import { Meta, Story } from "@storybook/react";
import { UseSessionContext } from "../../../features/auth/hooks/useSession";
import { Header, HeaderProps } from "./Header";

export default {
  title: "App/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    email: {
      defaultValue: "jdoe@example.com",
      control: { type: "text" },
    },
    name: {
      defaultValue: "Jane Doe",
      control: { type: "text" },
    },
    isLoadingSession: {
      defaultValue: false,
      control: { type: "boolean" },
    },
    isLoggedIn: {
      defaultValue: false,
      control: { type: "boolean" },
    },
  },
} as Meta;

interface StoryProps {
  email?: string;
  name?: string;
  isLoadingSession: boolean;
  isLoggedIn: boolean;
}

const Template: Story<HeaderProps & StoryProps> = ({
  email,
  name,
  isLoadingSession,
  isLoggedIn,
  ...props
}) => (
  <UseSessionContext.Provider
    value={{
      selectIdentity: () =>
        isLoggedIn
          ? {
              id: "",
              schema_id: "",
              schema_url: "",
              state: null,
              traits: {
                email: email || "",
                name,
              },
            }
          : undefined,
      selectIsVerified: () => true,
      selectSession: () =>
        isLoggedIn && !isLoadingSession ? { id: "" } : undefined,
      selectSessionLastUpdated: () => (isLoadingSession ? undefined : 1),
      whoamiQueryArg: skipToken,
    }}
  >
    <Header {...props} />
  </UseSessionContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "Header";
