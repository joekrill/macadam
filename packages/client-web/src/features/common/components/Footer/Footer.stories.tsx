import { Flex } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { Footer, FooterProps } from "./Footer";

export default {
  title: "Common/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true.valueOf,
    },
  },
} as Meta;

const Template: Story<FooterProps> = (args) => (
  <Flex direction="column" height="100vh">
    <Flex flex={1} />
    <Footer {...args} />
  </Flex>
);

export const Default = Template.bind({});

Default.storyName = "Footer";
