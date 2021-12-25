import { SerializedError } from "@reduxjs/toolkit";
import { Meta, Story } from "@storybook/react";
import { LocaleCode } from "../../constants";
import {
  LocaleErrorNotifier,
  LocaleErrorNotifierContext,
} from "./LocaleErrorNotifier";

export default {
  title: "i18n/LocaleErrorNotifier",
  component: LocaleErrorNotifier,
  argTypes: {
    error: {
      control: {
        type: "object",
      },
      defaultValue: {
        locale: "en-US",
        error: { message: "The error message" },
      },
    },
  },
} as Meta;

const Template: Story<{
  error?: { locale: LocaleCode; error: SerializedError };
}> = (args) => (
  <LocaleErrorNotifierContext.Provider
    value={{
      selectLastError: () => args.error,
    }}
  >
    <LocaleErrorNotifier />
  </LocaleErrorNotifierContext.Provider>
);

export const Default = Template.bind({});

Default.storyName = "LocaleErrorNotifier";
