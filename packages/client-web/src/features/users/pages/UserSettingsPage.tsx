import { Box, Container } from "@chakra-ui/react";
import {
  Link as ReactRouterLink,
  Route,
  Routes,
  useMatch,
} from "react-router-dom";
import { SettingsPage } from "../../auth/pages/SettingsPage";
import { Sidebar } from "../../common/components/Sidebar/Sidebar";
import { SidebarNavItem } from "../../common/components/Sidebar/SidebarNavItem";
import { UserSessions } from "../components/UserSettings/UserSessions";

export const UserSettingsPage = () => {
  const match = useMatch("/settings/:page");

  return (
    <Container
      as="section"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      minH="100vh"
      maxW="container.lg"
    >
      <Sidebar>
        <SidebarNavItem isActive={!match} as={ReactRouterLink} to="">
          Profile &amp; Login
        </SidebarNavItem>
        <SidebarNavItem
          isActive={match?.params.page === "sessions"}
          as={ReactRouterLink}
          to="sessions"
        >
          Sessions
        </SidebarNavItem>
      </Sidebar>
      <Box as="main" px="4" width="full">
        <Routes>
          <Route index element={<SettingsPage headingTextAlign="left" />} />
          <Route path="preferences" element={<Box>Preferences</Box>} />
          <Route path="sessions" element={<UserSessions />} />
        </Routes>
      </Box>
    </Container>
  );
};
