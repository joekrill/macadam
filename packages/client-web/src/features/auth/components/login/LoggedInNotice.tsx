import {
  Alert,
  AlertIcon,
  chakra,
  Flex,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { useSession } from "../../hooks/useSession";
import { HomepageButton } from "../HomepageButton";
import { LogoutButton } from "../LogoutButton";

export interface LoggedInNoticeProps {
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
export const LoggedInNotice = ({ onLogout }: LoggedInNoticeProps) => {
  const { username } = useSession();

  return (
    <VStack alignItems="stretch">
      <Alert status="error" variant="subtle">
        <AlertIcon />
        <Text>
          {username ? (
            <FormattedMessage
              id="auth.loggedInNotice.messageWithUsername"
              description="The message telling the user that they are already logged in when their username is available"
              defaultMessage="You're already logged in as <e>{username}</e>."
              values={{
                username,
                e: (chunks: ReactElement) => (
                  <chakra.strong>{chunks}</chakra.strong>
                ),
              }}
            />
          ) : (
            <FormattedMessage
              id="auth.loggedInNotice.messageWithoutUsername"
              description="The message telling the user that they are already logged in when their username is not available"
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
          isTruncated
        />
      </Flex>
    </VStack>
  );
};
