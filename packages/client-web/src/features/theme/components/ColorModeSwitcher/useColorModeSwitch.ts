import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useIntl } from "react-intl";

export const useColorModeSwitch = () => {
  const { formatMessage } = useIntl();
  const { toggleColorMode } = useColorMode();
  const nextMode = useColorModeValue("dark", "light");
  const Icon = useColorModeValue(FaMoon, FaSun);
  const label = formatMessage(
    {
      id: "theme.colorModeSwitcher.switchColorModeLabel",
      defaultMessage:
        "Switch to {mode, select, dark {dark} light {light} other {}} mode",
    },
    { mode: nextMode },
  );

  return {
    toggleColorMode,
    label,
    Icon,
  };
};
