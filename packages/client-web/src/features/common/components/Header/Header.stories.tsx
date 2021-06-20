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
  },
} as Meta;

interface StoryProps {
  hasIdentity: boolean;
  isFetchingIdentity: boolean;
}

const Template: Story<HeaderProps & StoryProps> = ({
  hasIdentity = false,
  isFetchingIdentity = false,
  ...args
}) => (
  <HeaderContext.Provider
    value={{
      useWhoamiQuery: () =>
        ({
          isSuccess: hasIdentity,
          isLoading: isFetchingIdentity,
          refetch: () => {},
        } as any),
    }}
  >
    <Header {...args} />
  </HeaderContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "Header";
