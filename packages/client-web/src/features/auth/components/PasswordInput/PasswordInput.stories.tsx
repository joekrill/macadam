import { Box } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { PasswordInput, PasswordInputProps } from "./PasswordInput";

export default {
  title: "auth/PasswordInput",
  component: PasswordInput,
  // parameters: {
  //   layout: "centered",
  // },
  // argTypes: {
  //   children: { control: { type: "text" }, defaultValue: "Some text" },
  //   width: { control: { type: "text" } },
  // },
} as Meta;

const Template: Story<PasswordInputProps> = (args) => (
  <Box maxW="md">
    <PasswordInput {...args} />
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "PasswordInput";
