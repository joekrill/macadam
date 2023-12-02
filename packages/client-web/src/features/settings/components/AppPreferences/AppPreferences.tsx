import {
  Box,
  BoxProps,
  FormControl,
  FormLabel,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { ActiveLocaleSelect } from "../../../i18n/components/ActiveLocaleSelect/ActiveLocaleSelect";
import { ColorModeSelect } from "../../../theme/components/ColorModeSelect/ColorModeSelect";

export interface AppPreferencesProps extends BoxProps {}

export const AppPreferences = (props: AppPreferencesProps) => (
  <Box {...props}>
    <Heading mb="4" size="md">
      <FormattedMessage
        id="settings.appPreferences.heading"
        description="The heading text to show for the `Preferences` sections of a user's settings"
        defaultMessage="Preferences"
      />
    </Heading>
    <VStack spacing="4">
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="settings.appPreferences.colorMode.label"
            description="The label to show above the color mode selection dropdown in the user's preferences form"
            defaultMessage="Color Mode"
          />
        </FormLabel>
        <ColorModeSelect />
      </FormControl>
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="settings.appPreferences.activeLocale.label"
            description="The label to show above the locale selection dropdown in the user's preferences form"
            defaultMessage="Language"
          />
        </FormLabel>
        <ActiveLocaleSelect />
      </FormControl>
    </VStack>
  </Box>
);
