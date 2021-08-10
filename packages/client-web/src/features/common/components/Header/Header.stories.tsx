import { Meta, Story } from "@storybook/react";
import { Header, HeaderContext, HeaderProps } from "./Header";

export default {
  title: "Common/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isFetchingIdentity: {
      control: { type: "boolean" },
    },
    hasIdentity: {
      control: { type: "boolean" },
    },
    username: {
      control: { type: "text" },
    },
  },
} as Meta;

interface StoryProps {
  hasIdentity: boolean;
  isFetchingIdentity: boolean;
  username: string;
}

const Template: Story<HeaderProps & StoryProps> = ({
  username = "someone",
  hasIdentity = false,
  isFetchingIdentity = false,
  ...args
}) => (
  <HeaderContext.Provider
    value={{
      useSession: () =>
        ({
          isLoggedIn: hasIdentity,
          isLoggedOut: !hasIdentity,
          isLoading: isFetchingIdentity,
          username,
        } as any),
    }}
  >
    <Header {...args} />
  </HeaderContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "Header";
