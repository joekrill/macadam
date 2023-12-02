import { Select, SelectProps, useColorMode } from "@chakra-ui/react";
import { useIntl } from "react-intl";

export interface ColorModeSelectProps extends SelectProps {}

export const ColorModeSelect = (props: ColorModeSelectProps) => {
  const { formatMessage } = useIntl();
  const { setColorMode, colorMode } = useColorMode();

  return (
    <Select
      {...props}
      onChange={(event) => {
        if (props.onChange) {
          props.onChange(event);
        }

        if (event.isDefaultPrevented()) {
          return;
        }

        setColorMode(event.target.value);
      }}
      value={colorMode}
    >
      <option key="dark" value="dark">
        {formatMessage({
          id: "theme.colorModeSelect.darkMode.optionText",
          description:
            "The text to display for choosing dark mode when selecting a color mode",
          defaultMessage: "Dark",
        })}
      </option>
      <option key="light" value="light">
        {formatMessage({
          id: "theme.colorModeSelect.lightMode.optionText",
          description:
            "The text to display for choosing light mode when selecting a color mode",
          defaultMessage: "Light",
        })}
      </option>
    </Select>
  );
};
