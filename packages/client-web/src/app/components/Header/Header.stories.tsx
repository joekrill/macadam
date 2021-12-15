import { skipToken } from "@reduxjs/toolkit/query";
import { Meta, Story } from "@storybook/react";
import { UseSessionContext } from "../../../features/auth/hooks/useSession";
import { LocaleSelectContext } from "../../../features/i18n/components/LocaleSelect";
import { Header, HeaderProps } from "./Header";

export default {
  title: "common/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    email: {
      defaultValue: "jdoe@example.com",
      control: { type: "text" },
    },
    firstName: {
      defaultValue: "Jane",
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
    lastName: {
      defaultValue: "Doe",
      control: { type: "text" },
    },
  },
} as Meta;

interface StoryProps {
  email?: string;
  firstName?: string;
  isLoadingSession: boolean;
  isLoggedIn: boolean;
  lastName?: string;
}

const Template: Story<HeaderProps & StoryProps> = ({
  email,
  firstName,
  isLoadingSession,
  isLoggedIn,
  lastName,
  ...props
}) => (
  <LocaleSelectContext.Provider
    value={{
      selectCurrentLocale: () => "en",
      selectPendingLocale: () => undefined,
    }}
  >
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
                  name: {
                    first: firstName,
                    last: lastName,
                  },
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
  </LocaleSelectContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "Header";
