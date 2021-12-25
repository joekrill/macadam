import { Box } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { LOCALES } from "../../constants";
import { LocaleSelect, LocaleSelectProps } from "./LocaleSelect";

export default {
  title: "i18n/LocaleSelect",
  component: LocaleSelect,
  argTypes: {
    value: { control: { type: "select" }, options: LOCALES },
  },
} as Meta;

const Template: Story<LocaleSelectProps> = (args) => (
  <Box maxW="md">
    <LocaleSelect {...args} />
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "LocaleSelect";
