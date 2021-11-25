import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useIntl } from "react-intl";

export type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = ({
  onClick,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const { toggleColorMode } = useColorMode();
  const nextMode = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const label = formatMessage(
    {
      id: "theme.colorModeSwitcher.switchColorModeLabel",
      defaultMessage:
        "Switch to {mode, select, dark {dark} light {light} other {}} mode",
    },
    { mode: nextMode }
  );

  return (
    <IconButton
      variant="ghost"
      color="current"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }

        if (!e.isDefaultPrevented()) {
          toggleColorMode();
        }
      }}
      icon={<SwitchIcon />}
      aria-label={label}
      title={label}
      {...props}
    />
  );
};
