import { Box, FlexProps } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { DividerWithText } from "./DividerWithText";

export default {
  title: "Common/DividerWithText",
  component: DividerWithText,
  argTypes: {
    children: { control: { type: "text" }, defaultValue: "Some text" },
    width: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<FlexProps> = (args) => (
  <Box maxW="md">
    <DividerWithText {...args} />
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "DividerWithText";
