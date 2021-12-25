import { Flex } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { ActiveLocaleSelectContext } from "../../../features/i18n/components/ActiveLocaleSelect/ActiveLocaleSelect";
import { Footer, FooterProps } from "./Footer";

export default {
  title: "app/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    controls: {
      hideNoControlsWarning: true,
    },
  },
} as Meta;

const Template: Story<FooterProps> = (args) => (
  <ActiveLocaleSelectContext.Provider
    value={{
      selectPendingLocale: () => undefined,
      selectDeviceLocale: () => "en",
      selectSelectedLocale: () => "en",
    }}
  >
    <Flex direction="column" height="100vh">
      <Flex flex={1} />
      <Footer {...args} />
    </Flex>
  </ActiveLocaleSelectContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "Footer";
