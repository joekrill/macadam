import { Box, Container } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import {
  Link as ReactRouterLink,
  Route,
  Routes,
  useMatch,
} from "react-router-dom";
import { SettingsPage as ProfileSettingsPage } from "../../auth/pages/SettingsPage";
import { Sidebar } from "../../common/components/Sidebar/Sidebar";
import { SidebarNavItem } from "../../common/components/Sidebar/SidebarNavItem";
import { SessionsList } from "../../sessions/components/SessionsList";
import { AppPreferences } from "../components/AppPreferences/AppPreferences";

export const SettingsPageAuthenticated = () => {
  const match = useMatch("/settings/:page");

  return (
    <Container
      as="section"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      minH="100vh"
      maxW="container.lg"
    >
      <Sidebar mb="5" mr="3">
        <SidebarNavItem isActive={!match} as={ReactRouterLink} to="">
          <FormattedMessage
            id="settings.settingsPage.preferencesLink.label"
            defaultMessage="Preferences"
          />
        </SidebarNavItem>
        <SidebarNavItem
          isActive={match?.params.page === "profile"}
          as={ReactRouterLink}
          to="profile"
        >
          <FormattedMessage
            id="settings.settingsPage.profileLink.label"
            defaultMessage="Profile &amp; Login"
          />
        </SidebarNavItem>
        <SidebarNavItem
          isActive={match?.params.page === "sessions"}
          as={ReactRouterLink}
          to="sessions"
        >
          <FormattedMessage
            id="settings.settingsPage.sessionsLink.label"
            defaultMessage="Sessions"
          />
        </SidebarNavItem>
      </Sidebar>
      <Box as="main" px="4" width="full">
        <Routes>
          <Route index element={<AppPreferences />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="sessions" element={<SessionsList />} />
        </Routes>
      </Box>
    </Container>
  );
};
