import { Box } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { Locale, LOCALES } from "../locales";
import { LocaleSelect, LocaleSelectContext } from "./LocaleSelect";

export default {
  title: "i18n/LocaleSelect",
  component: LocaleSelect,
  argTypes: {
    currentLocale: { control: { type: "select" }, options: LOCALES },
    pendingLocale: {
      control: { type: "select" },
      options: [undefined, ...LOCALES],
    },
  },
} as Meta;

const Template: Story<{ currentLocale: Locale; pendingLocale?: Locale }> = (
  args
) => (
  <Box maxW="md">
    <LocaleSelectContext.Provider
      value={{
        selectCurrentLocale: () => args.currentLocale,
        selectPendingLocale: () => args.pendingLocale,
      }}
    >
      <LocaleSelect />
    </LocaleSelectContext.Provider>
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "LocaleSelect";
