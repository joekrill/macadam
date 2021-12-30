import { Box } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { ErrorAlert, ErrorAlertProps } from "./ErrorAlert";

export default {
  title: "Errors/ErrorAlert",
  component: ErrorAlert,
  argTypes: {
    title: { control: { type: "text" } },
    onRetryClick: { action: "onRetryClick", table: { disable: true } },
    status: {
      control: { type: "inline-radio" },
      options: ["success", "info", "warning", "error"],
    },
  },
} as Meta;

const Template: Story<ErrorAlertProps> = (args) => (
  <Box maxW="xl">
    <ErrorAlert {...args} disableCapture />
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "ErrorAlert";
