import { Box } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { PasswordInput, PasswordInputProps } from "./PasswordInput";

export default {
  title: "Auth/PasswordInput",
  component: PasswordInput,
} as Meta;

const Template: Story<PasswordInputProps> = (args) => (
  <Box maxW="md">
    <PasswordInput {...args} />
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "PasswordInput";
