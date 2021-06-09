import { Button, ButtonProps } from "@chakra-ui/react";
import { Story, Meta } from "@storybook/react";

export default {
  title: "Button",
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: "This is a button",
  colorScheme: "blue",
};

Default.storyName = "Button";
