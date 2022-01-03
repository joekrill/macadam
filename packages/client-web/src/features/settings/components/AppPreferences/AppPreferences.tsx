import { Box, FormControl, FormLabel, Heading, VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { ActiveLocaleSelect } from "../../../i18n/components/ActiveLocaleSelect/ActiveLocaleSelect";
import { ColorModeSelect } from "../../../theme/components/ColorModeSelect/ColorModeSelect";

export const AppPreferences = () => (
  <Box>
    <Heading mb="4" size="md">
      <FormattedMessage
        id="settings.appPreferences.title"
        defaultMessage="Preferences"
      />
    </Heading>
    <VStack spacing="4">
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="settings.appPreferences.colorMode.label"
            defaultMessage="Color Mode"
          />
        </FormLabel>
        <ColorModeSelect />
      </FormControl>
      <FormControl>
        <FormLabel>
          <FormattedMessage
            id="settings.appPreferences.activeLocale.label"
            defaultMessage="Language"
          />
        </FormLabel>
        <ActiveLocaleSelect />
      </FormControl>
    </VStack>
  </Box>
);
