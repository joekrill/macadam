import { Box, BoxProps } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { Card } from "./Card";

export default {
  title: "Common/Card",
  component: Card,
  argTypes: {
    height: { control: { type: "text" } },
    width: { control: { type: "text" } },
  },
} as Meta;

const Template: Story<BoxProps> = (args) => (
  <Box maxW="xl">
    <Card {...args} />
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "Card";
