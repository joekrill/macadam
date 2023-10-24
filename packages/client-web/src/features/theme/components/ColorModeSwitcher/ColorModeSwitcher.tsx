import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { useColorModeSwitch } from "./useColorModeSwitch";

export type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = ({
  onClick,
  ...props
}) => {
  const { label, toggleColorMode, Icon } = useColorModeSwitch();

  return (
    <IconButton
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }

        if (!e.isDefaultPrevented()) {
          toggleColorMode();
        }
      }}
      icon={<Icon />}
      aria-label={label}
      title={label}
      {...props}
    />
  );
};
