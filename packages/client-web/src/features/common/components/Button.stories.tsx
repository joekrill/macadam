import { Button, ButtonProps } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { theme } from "../../theme";

export default {
  title: "Chakra UI/Button",
  component: Button,
  argTypes: {
    colorScheme: {
      options: Object.keys(theme.colors),
      control: { type: "select" },
    },
    variant: {
      options: Object.keys(theme.components.Button.variants),
      control: { type: "inline-radio" },
    },
    size: {
      options: Object.keys(theme.components.Button.sizes),
      control: { type: "inline-radio" },
    },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: "This is a button",
  colorScheme: "blue",
  size: "md",
  variant: "solid",
};

Default.storyName = "Button";
