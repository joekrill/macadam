import { Flex } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { LocaleSelectContext } from "../../../features/i18n/components/LocaleSelect";
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
  <LocaleSelectContext.Provider
    value={{
      selectCurrentLocale: () => "en",
      selectPendingLocale: () => undefined,
    }}
  >
    <Flex direction="column" height="100vh">
      <Flex flex={1} />
      <Footer {...args} />
    </Flex>
  </LocaleSelectContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "Footer";
