import { Box, Container, Skeleton } from "@chakra-ui/react";
import { useSession } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";
import { Outlet, Link as ReactRouterLink, useMatch } from "react-router-dom";
import { Sidebar } from "../../common/components/Sidebar/Sidebar";
import { SidebarNavItem } from "../../common/components/Sidebar/SidebarNavItem";

export const SettingsPageLayout = () => {
  const { isLoggedIn } = useSession();
  const preferencesMatch = useMatch("/settings");
  const profileMatch = useMatch("/settings/profile");
  const sessionsMatch = useMatch("/settings/sessions");

  return (
    <Skeleton isLoaded={isLoggedIn !== undefined}>
      {isLoggedIn === true ? (
        <Container
          as="section"
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          minH="100vh"
          maxW="container.lg"
        >
          <Sidebar mb="5" mr="3">
            <SidebarNavItem
              isActive={!!preferencesMatch}
              as={ReactRouterLink}
              to=""
            >
              <FormattedMessage
                id="settings.settingsPage.preferencesLink.text"
                description="Text displayed for the sidebar link of the settings page that takes the user to their preferences"
                defaultMessage="Preferences"
              />
            </SidebarNavItem>
            <SidebarNavItem
              isActive={!!profileMatch}
              as={ReactRouterLink}
              to="profile"
            >
              <FormattedMessage
                id="settings.settingsPage.profileLink.text"
                description="Text displayed for the sidebar link of the settings page that takes the user to their profile"
                defaultMessage="Profile & Login"
              />
            </SidebarNavItem>
            <SidebarNavItem
              isActive={!!sessionsMatch}
              as={ReactRouterLink}
              to="sessions"
            >
              <FormattedMessage
                id="settings.settingsPage.sessionsLink.text"
                description="Text displayed for the sidebar link of the settings page that takes the user to their list of sessions"
                defaultMessage="Sessions"
              />
            </SidebarNavItem>
          </Sidebar>
          <Box as="main" px="4" width="full">
            <Outlet />
          </Box>
        </Container>
      ) : (
        <Container as="section" maxW="container.sm">
          <Outlet />
        </Container>
      )}
    </Skeleton>
  );
};
