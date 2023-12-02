import {
  Alert,
  AlertIcon,
  chakra,
  Flex,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "@macadam/api-client";
import { FaSignOutAlt } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { HomepageButton } from "../../../common/components/HomepageButton";
import { LogoutButton } from "../LogoutButton/LogoutButton";

export interface LoggedInAlreadyNoticeProps {
  onLogout?: () => void;
}

/**
 * Displays a message letting the user know that they are already logged in,
 * and giving them the option of logging out, as well as proviging a link to the
 * main home page.
 *
 * This is meant to be used in the login page and is shown if the user somehow
 * gets to that page even though they are already logged in.
 */
export const LoggedInAlreadyNotice = ({
  onLogout,
}: LoggedInAlreadyNoticeProps) => {
  const { username } = useSession();

  return (
    <VStack alignItems="stretch">
      <Alert status="error" variant="subtle">
        <AlertIcon />
        <Text>
          {username ? (
            <FormattedMessage
              id="auth.loggedInAlreadyNotice.messageWithUsername"
              description="The message telling the user that they are already logged and they have a username which can be used as part of the message"
              defaultMessage="You're already logged in as <e>{username}</e>."
              values={{
                username,
                e: (chunks) => <chakra.strong>{chunks}</chakra.strong>,
              }}
            />
          ) : (
            <FormattedMessage
              id="auth.loggedInAlreadyNotice.messageWithoutUsername"
              description="The message telling the user that they are already logged but there is no username which can be used as part of the message"
              defaultMessage="You're already logged in."
            />
          )}
        </Text>
      </Alert>
      <Flex justifyContent="space-between">
        <HomepageButton />
        <LogoutButton
          rightIcon={<Icon as={FaSignOutAlt} />}
          colorScheme="blue"
          variant="outline"
          onLogoutComplete={onLogout}
          noOfLines={1}
        />
      </Flex>
    </VStack>
  );
};
