import { Container } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { Sidebar, SidebarProps } from "./Sidebar";
import { SidebarNavItem } from "./SidebarNavItem";

export default {
  title: "common/Sidebar",
  component: Sidebar,
  argTypes: {
    activeItem: {
      control: { type: "inline-radio" },
      options: ["(none)", "profile", "preferences", "account", "sessions"],
    },
  },
} as Meta;

const Template: Story<SidebarProps & { activeItem: string }> = ({
  activeItem,
  ...args
}) => (
  <Container maxW="container.lg">
    <Sidebar {...args}>
      <SidebarNavItem isActive={activeItem === "profile"}>
        Profile &amp; Login
      </SidebarNavItem>
      <SidebarNavItem isActive={activeItem === "preferences"}>
        Preferences
      </SidebarNavItem>
      <SidebarNavItem isActive={activeItem === "account"}>
        Account
      </SidebarNavItem>
      <SidebarNavItem isActive={activeItem === "sessions"}>
        Sessions
      </SidebarNavItem>
    </Sidebar>
  </Container>
);

export const Default = Template.bind({});

Default.storyName = "Sidebar";
